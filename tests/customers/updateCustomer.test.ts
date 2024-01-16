import request from 'supertest'
import { app, server } from '../../app'
import * as authService from '../../services/authService'
import { customerService } from '../../services/customerService'
import {
  clearDatabase,
  startMongoMemoryServer,
  stopMongoMemoryServer,
} from '../setup'
import { ObjectId } from 'mongodb'

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

describe('Test API to get update a particular customer', () => {
  test('Should get 401 when auth missing', async () => {
    const response = await request(app).put('/customers/123').send({
      name: 'XYZ',
      email: 'xyz@gmail.com',
    })
    expect(response.status).toBe(401)
  })

  test('Should get 404 when incorrect ObjectId format', async () => {
    const response = await request(app)
      .put('/customers/123')
      .send({
        name: 'XYZ',
        email: 'xyz@gmail.com',
      })
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(404)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0]).toBe('Invalid customer id')
  })

  test('Should get 404 when wrong customer id provided', async () => {
    const customerId = new ObjectId()
    const response = await request(app)
      .put('/customers/' + customerId.toHexString())
      .send({
        name: 'XYZ',
        email: 'xyz@gmail.com',
      })
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
      .put(`/customers/${result.insertedId.toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New name',
        email: 'xyz-modified@gmail.com',
        age: 44,
      })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('age')
    expect(response.body.name).toBe('New name')
    expect(response.body.email).toBe('xyz-modified@gmail.com')
    expect(response.body.age).toBe(44)
    expect(response.body._id).toBe(result.insertedId.toHexString())
  })
})
