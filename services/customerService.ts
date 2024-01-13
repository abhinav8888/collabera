import type { InsertOneResult, ObjectId, OptionalId, WithoutId } from 'mongodb'
import customerRepository from '../repositories/customerRepository'
import type { Customer } from '../models/customer'

interface CustomerService {
  createCustomer: (
    customer: WithoutId<Customer>
  ) => Promise<InsertOneResult<Customer>>
  updateCustomer: (
    _id: ObjectId,
    customer: Customer
  ) => Promise<Customer | null>
  getCustomerList: () => Promise<Customer[]>
  getCustomer: (_id: ObjectId) => Promise<Customer | null>
  removeCustomer: (_id: ObjectId) => Promise<boolean>
}

const getCustomerList = async (): Promise<Customer[]> => {
  return await customerRepository.find({})
}

const getCustomer = async (_id: ObjectId): Promise<Customer | null> => {
  return await customerRepository.findOne({ _id })
}

const createCustomer = async (
  customer: OptionalId<Customer>
): Promise<InsertOneResult<Customer>> => {
  return await customerRepository.insertOne(customer)
}

const updateCustomer = async (
  _id: ObjectId,
  customer: Customer
): Promise<Customer | null> => {
  return await customerRepository.findByIdAndUpdate({ _id }, { $set: customer })
}

const removeCustomer = async (_id: ObjectId): Promise<boolean> => {
  const result = await customerRepository.deleteOne({ _id })
  return result.deletedCount === 1
}

export const customerService: CustomerService = {
  createCustomer,
  updateCustomer,
  getCustomerList,
  getCustomer,
  removeCustomer,
}
