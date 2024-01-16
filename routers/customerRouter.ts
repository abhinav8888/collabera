import express from 'express'
import CustomerController from '../controllers/customerController'
import { AuthenticationMiddleWare } from '../services/authService'

const router = express.Router()
router.use(AuthenticationMiddleWare)

// GET /customers
router.get('/', CustomerController.getAllCustomers)

// GET /customers/:id
router.get('/:id', CustomerController.getCustomer)

// POST /customers
router.post('/', CustomerController.createCustomer)

// PUT /customers/:id
router.put('/:id', CustomerController.updateCustomer)

// DELETE /customers/:id
router.delete('/:id', CustomerController.deleteCustomer)

export default router
