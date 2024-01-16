import request from 'supertest'
import { app, server } from '../../app'
import * as authService from '../../services/authService'
import {
  clearDatabase,
  startMongoMemoryServer,
  stopMongoMemoryServer,
} from '../setup'

beforeAll(async () => {
  await startMongoMemoryServer()
})

beforeEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  server.close()
  await stopMongoMemoryServer()
})

describe('Login test', () => {
  test('Login should fail when no user created', async () => {
    const response = await request(app).post('/login').send({
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    expect(response.status).toBe(401)
  })

  test('Login should fail if password not submitted', async () => {
    // create user
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/login').send({
      email: 'abhinav@gmail.com',
    })
    expect(response.status).toBe(400)
  })

  test('Login should fail if email not submitted', async () => {
    // create user
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/login').send({
      password: '123456',
    })
    expect(response.status).toBe(400)
  })

  test('Login should fail for incorrect email', async () => {
    // create user
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/login').send({
      email: 'abhinav@yahoo.com',
      password: '123456',
    })
    expect(response.status).toBe(401)
  })
  test('Login should fail for incorrect password', async () => {
    // create user
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/login').send({
      email: 'abhinav@gmail.com',
      password: '1234567',
    })
    expect(response.status).toBe(401)
  })

  test('Login should succeed', async () => {
    // create user
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/login').send({
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('name')
    expect(response.body.user).toHaveProperty('email')
    expect(response.body.user.email).toBe('abhinav@gmail.com')
  })
})
