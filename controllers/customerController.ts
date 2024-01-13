import type { Request, RequestHandler, Response } from 'express'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import type { Customer } from '../models/customer'
import { customerService } from '../services/customerService'

const createCustomerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().positive(),
})

interface CustomerController {
  createCustomer: RequestHandler
  getAllCustomers: RequestHandler
  updateCustomer: RequestHandler
  deleteCustomer: RequestHandler
  getCustomer: RequestHandler
}

const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age } = createCustomerSchema.parse(req.body)
    const savedCustomer = await customerService.createCustomer({
      name,
      email,
      age,
    })
    res.status(201).json(savedCustomer)
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' })
  }
}
const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers: Customer[] = await customerService.getCustomerList()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
const getCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await customerService.getCustomer(
      new ObjectId(req.params.id)
    )
    if (customer === null) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age } = createCustomerSchema.parse(req.body)
    const customerId: ObjectId = new ObjectId(req.params.id)
    const customer = await customerService.updateCustomer(customerId, {
      name,
      email,
      age,
      _id: customerId,
    })
    if (customer == null) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await customerService.removeCustomer(
      new ObjectId(req.params.id)
    )
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const customerController: CustomerController = {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
}

export default customerController
