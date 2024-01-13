import type { Customer } from '../models/customer'
import BaseRepository from './baseRepository'

class CustomerRepository extends BaseRepository<Customer> {
  collectionName: string = 'customers'
}

const customerRepository = new CustomerRepository()
export default customerRepository
