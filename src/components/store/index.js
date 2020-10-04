import {Router} from 'express'

import {
  inventories,
  suppliers,
  deleteSuppliers,
  editSupplier,
  addSupplier,
  oftenSupply,
  rarelySupply,
  getTransactionData,
  processTransaction,
  transactions,
  deleteTransactions
} from './controllers'
import {suppliersValidation} from './validation'
import {validateUser} from '../../shared/user'
import validate from '../../shared/validateInput'

const router = Router()

router.get('/:idStore/inventories/', validateUser, inventories)
router.get('/:idStore/transactions', validateUser, transactions)
router.post('/:idStore/transactions/delete', validateUser, deleteTransactions)
router.get('/:idStore/transaction/', validateUser, getTransactionData)
router.post('/:idStore/transaction/', validateUser, processTransaction)
router.get('/:idStore/suppliers', validateUser, suppliers)
router.post('/:idStore/suppliers', validateUser, addSupplier)
router.put('/:idStore/suppliers/:idSupplier', validateUser, editSupplier)
router.post('/:idStore/suppliers/delete', validateUser, deleteSuppliers)
router.get('/:idStore/suppliers/oftenSupply', validateUser, oftenSupply)
router.get('/:idStore/suppliers/rarelySupply', validateUser, rarelySupply)

export default router
