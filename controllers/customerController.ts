import type { Request, RequestHandler, Response } from 'express'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import type { Customer } from '../models/customer'
import { customerService } from '../services/customerService'
import { formatZodError } from '../services/formattingService'

const createCustomerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().positive(),
})

const updateCustomerSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  age: z.number().positive().optional(),
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
    const result = await customerService.createCustomer({
      name,
      email,
      age,
    })
    res.status(201).json({
      message: 'Customer created successfully',
      _id: result.insertedId,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodError(error)
      res.status(400).json({ errors })
    } else {
      res.status(500).json({ errors: ['Internal Server Error'] })
    }
  }
}
const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers: Customer[] = await customerService.getCustomerList()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ errors: ['Internal Server Error'] })
  }
}
const getCustomer = async (req: Request, res: Response): Promise<void> => {
  let customerId: ObjectId
  try {
    customerId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(404).json({ errors: ['Invalid customer id'] })
    return
  }

  try {
    const customer = await customerService.getCustomer(customerId)
    if (customer === null) {
      res.status(404).json({ errors: ['Customer not found'] })
      return
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ errors: ['Internal Server Error'] })
  }
}

const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  let customerId: ObjectId
  try {
    customerId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(404).json({ errors: ['Invalid customer id'] })
    return
  }
  try {
    const { name, email, age } = updateCustomerSchema.parse(req.body)
    customerId = new ObjectId(req.params.id)
    const customer = await customerService.updateCustomer(customerId, {
      name,
      email,
      age,
      _id: customerId,
    })
    if (customer == null) {
      res.status(404).json({ errors: ['Customer not found'] })
      return
    }
    res.json(customer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodError(error)
      res.status(400).json({ errors })
    } else {
      res.status(500).json({ errors: ['Internal Server Error'] })
    }
  }
}

const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  let customerId: ObjectId
  try {
    customerId = new ObjectId(req.params.id)
  } catch (error) {
    res.status(404).json({ errors: ['Invalid customer id'] })
    return
  }

  try {
    const customer = await customerService.removeCustomer(customerId)
    if (!customer) {
      res.status(404).json({ errors: ['Customer not found'] })
      return
    }
    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ errors: ['Internal Server Error'] })
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
