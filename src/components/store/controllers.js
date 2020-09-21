import {
  getInventories,
  getSuppliers,
  getRarelySupply,
  getOftenSupply,
  dbDeleteSuppliers,
  dbAddSupplier,
  dbEditSupplier,
  dbGetStore,
  dbGetTotalInvoice,
  dbCreateInvoice
} from './utils'

export async function inventories(req, res) {
  const {idStore} = req.params
  const {q, minStock = 0} = req.query
  const data = await getInventories({
    idStore,
    minStock,
    q: `${q}%`
  })
  res.json({
    code: 200,
    status: 'success',
    data
  })
}

export async function suppliers(req, res) {
  const {idStore} = req.params
  const {page, limit, sort, order, q} = req.query
  const suppliers = await getSuppliers({
    idStore,
    sort,
    order,
    search: `${q}%`,
    page: Number(page) * limit - limit,
    limit: Number(limit)
  })
  res.json(suppliers)
}

export async function deleteSuppliers(req, res) {
  await dbDeleteSuppliers(req.params.idStore, req.body.data)
  res.json({
    status: 'success',
    code: '200'
  })
}

export async function addSupplier(req, res) {
  const data = Object.assign({}, req.body, req.params)
  const {insertId} = await dbAddSupplier(data)
  res.json({
    status: 'success',
    code: '200',
    data: {
      insertId
    }
  })
}

export async function editSupplier(req, res) {
  const {idStore, idSupplier} = req.params
  await dbEditSupplier(idStore, idSupplier, req.body.data)

  res.json({
    code: 200,
    status: 'success'
  })
}

export async function rarelySupply(req, res) {
  const data = await getRarelySupply(req.params.idStore)
  res.json({
    code: 200,
    status: 'success',
    data
  })
}

export async function oftenSupply(req, res) {
  const data = await getOftenSupply(req.params.idStore)
  res.json({
    code: 200,
    status: 'success',
    data
  })
}

export async function getTransactionData(req, res) {
  const store = await dbGetStore(req.params.idStore)
  const invoice = await dbGetTotalInvoice(req.params.idStore)
  const storeAlias = store.name
    .split(' ')
    .map((str) => str.slice(0, 1).toUpperCase())
    .join('')
  let invoiceNumber

  if (!invoice.total_invoice) {
    invoiceNumber = `${storeAlias}001`
  } else {
    invoiceNumber = `${storeAlias}00${invoice.total_invoice + 1}`
  }

  res.json({
    code: 200,
    status: 'success',
    data: {
      invoice: invoiceNumber
    }
  })
}

export async function processTransaction(req, res) {
  await dbCreateInvoice(req.params.idStore, req.body)
  res.json({
    code: 200,
    status: 'success'
  })
}
