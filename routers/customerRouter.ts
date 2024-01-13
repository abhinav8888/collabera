import express from 'express'
import CustomerController from '../controllers/customerController'
import { AuthenticationMiddleWare } from '../services/authService'

const router = express.Router()

// GET /customers
router.get('/', AuthenticationMiddleWare, CustomerController.getAllCustomers)

// GET /customers/:id
router.get('/:id', CustomerController.getCustomer)

// POST /customers
router.post('/', AuthenticationMiddleWare, CustomerController.createCustomer)

// PUT /customers/:id
router.put('/:id', AuthenticationMiddleWare, CustomerController.updateCustomer)

// DELETE /customers/:id
router.delete(
  '/:id',
  AuthenticationMiddleWare,
  CustomerController.deleteCustomer
)

export default router
