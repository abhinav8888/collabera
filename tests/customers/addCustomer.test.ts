import request from 'supertest'
import { app, server } from '../../app'
import * as authService from '../../services/authService'
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

describe('Test Adding customer flow', () => {
  test('Should get 401 when auth missing', async () => {
    const response = await request(app).post('/customers').send({
      email: 'abhinav@yahoo.com',
      name: 'Abhinav',
      age: 25,
    })
    expect(response.status).toBe(401)
  })

  test('Should get 400 when email not provided', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Abhinav',
        age: 25,
      })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('email')
    expect(response.body.errors[0].message).toBe('Required')
  })

  test('Should get 400 when name not provided', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'xyz@gmail.com',
        age: 25,
      })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('name')
    expect(response.body.errors[0].message).toBe('Required')
  })

  test('Should get 201 when correct payload provided', async () => {
    const response = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'xyz@gmail.com',
        name: 'xyz',
        age: 25,
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
  })
})
