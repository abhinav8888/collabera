import { ObjectId } from 'mongodb'
import request from 'supertest'
import { app, server } from '../../app'
import * as authService from '../../services/authService'
import { customerService } from '../../services/customerService'
import {
  clearDatabase,
  startMongoMemoryServer,
  stopMongoMemoryServer,
} from '../setup'

let token: string | undefined

beforeAll(async () => {
  await startMongoMemoryServer()
})

beforeEach(async () => {
  await clearDatabase()
  await authService.signupUser({
    name: 'Abhinav',
    email: 'abhinav@gmail.com',
    password: '123456',
  })
  const response = await authService.login('abhinav@gmail.com', '123456')
  token = response?.token
})

afterAll(async () => {
  server.close()
  await stopMongoMemoryServer()
})

describe('Test Customer delete API', () => {
  test('Should get 401 when auth missing', async () => {
    const response = await request(app).delete('/customers/123')
    expect(response.status).toBe(401)
  })

  test('Should get 404 when incorrect ObjectId format', async () => {
    const response = await request(app)
      .delete('/customers/123')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0]).toBe('Invalid customer id')
  })

  test('Should get 404 when wrong customer id provided', async () => {
    const customerId = new ObjectId()
    const response = await request(app)
      .delete('/customers/' + customerId.toHexString())
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0]).toBe('Customer not found')
  })

  test('Should get 200 when customer found', async () => {
    const result = await customerService.createCustomer({
      name: 'XYZ',
      email: 'xyz@gmail.com',
      age: 25,
    })
    const response = await request(app)
      .delete(`/customers/${result.insertedId.toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Customer deleted successfully')
    const customer = await customerService.getCustomer(result.insertedId)
    expect(customer).toBeNull()
  })
})
