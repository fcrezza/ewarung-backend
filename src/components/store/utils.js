import query, {pool} from '../../store'

export async function getInventories({q, minStock, idStore}) {
  console.log(1, minStock, idStore)
  return await query(
    'select id, name, price, stock from inventories where idStore = ? and name like ? and stock >= ?',
    [idStore, q, minStock]
  )
}

export async function getSuppliers({
  idStore,
  sort,
  order,
  search,
  page,
  limit
}) {
  const [
    totalRecords
  ] = await query(
    'select count(id) as total from suppliers where idStore = ? like ?',
    [idStore, search]
  )
  const orderBy = {
    toSqlString: () => `${sort} ${order}`
  }
  const data = await query(
    `select id, name, address, phoneNumber from suppliers where idStore = ? and name like ? order by ? limit ? offset ?`,
    [idStore, search, orderBy, limit, page]
  )

  return {
    data,
    ...totalRecords
  }
}

export async function dbDeleteSuppliers(idStore, data) {
  await query('delete from suppliers where idStore = ? and id in (?)', [
    idStore,
    data
  ])
}

export async function dbAddSupplier(data) {
  const supplier = await query('insert into suppliers set ?', data)
  return supplier
}

export async function dbEditSupplier(idStore, idSupplier, data) {
  await query('update suppliers set ? where idStore = ? and id = ?', [
    data,
    idStore,
    idSupplier
  ])
}

export async function getOftenSupply(idStore) {
  const data = await query(
    'select s.id, s.name, count(i.id) as total from ewarung.suppliers s left join ewarung.inventories i on s.id=idSupplier where s.idStore = ? group by s.id order by total desc limit 5',
    idStore
  )
  return data
}

export async function getRarelySupply(idStore) {
  const data = await query(
    'select s.id, s.name, count(i.id) as total from ewarung.suppliers s left join ewarung.inventories i on s.id=idSupplier where s.idStore = ? group by s.id order by total asc limit 5',
    idStore
  )
  return data
}

export async function dbGetStore(idStore) {
  const [store] = await query('select * from stores where id = ?', idStore)
  return store
}

export async function dbGetTotalInvoice(idStore) {
  const [invoice] = await query(
    'select count(*) as total_invoice from invoices where id_store = ?',
    idStore
  )
  return invoice
}

export async function dbCreateInvoice(idStore, data) {
  const {items, cash, totalPrice, cashback, invoice} = data
  const connection = await pool.getConnection()
  try {
    await connection.query('START TRANSACTION')
    const [record] = await connection.query('insert into invoices set ? ', {
      cash,
      cashback,
      invoice,
      id_store: idStore,
      total_price: totalPrice
    })
    await connection.query(
      'insert into transactions (idGoods, quantity, totalPrice, idInvoice) value ? ',
      [
        items.map((item) => [
          item.id,
          item.quantity,
          item.totalPrice,
          record.insertId
        ])
      ]
    )
    for (let item of items) {
      await connection.query(
        'update inventories set stock = ? where idStore = ? and id = ?',
        [item.stock, idStore, item.id]
      )
    }
    await connection.query('COMMIT')
  } catch (e) {
    await connection.query('ROLLBACK')
    throw e
  } finally {
    await connection.release()
  }
}
