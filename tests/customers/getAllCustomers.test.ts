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

describe('Test API to fetch all customers', () => {
  test('Should get 401 when auth missing', async () => {
    const response = await request(app).get('/customers')
    expect(response.status).toBe(401)
  })

  test('Should get 200 when auth provided with no customers added', async () => {
    const response = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(0)
  })

  test('Should get 200 when auth provided with customers added', async () => {
    const customer = await customerService.createCustomer({
      email: 'xyz@gmail.com',
      name: 'XYZ',
      age: 25,
    })
    const response = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(1)
    expect(response.body[0].name).toBe('XYZ')
    expect(response.body[0].email).toBe('xyz@gmail.com')
    expect(response.body[0].age).toBe(25)
    expect(response.body[0]._id).toBe(customer.insertedId.toHexString())
  })

  test('Multiple customers should be returned when multiple present', async () => {
    const firstCustomer = await customerService.createCustomer({
      email: 'xyz1@gmail.com',
      name: 'XYZ1',
      age: 25,
    })
    const secondCustomer = await customerService.createCustomer({
      email: 'xyz2@gmail.com',
      name: 'XYZ2',
      age: 25,
    })
    const response = await request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBe(2)
    expect(response.body[0]._id).toBe(firstCustomer.insertedId.toHexString())
    expect(response.body[1]._id).toBe(secondCustomer.insertedId.toHexString())
    expect(response.body[0].name).toBe('XYZ1')
    expect(response.body[1].name).toBe('XYZ2')
    expect(response.body[0].email).toBe('xyz1@gmail.com')
    expect(response.body[1].email).toBe('xyz2@gmail.com')
  })
})
