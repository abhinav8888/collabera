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

describe('Signup test', () => {
  test('Signup should fail when payload has missing data', async () => {
    const response = await request(app).post('/signup').send({
      password: '123456',
      name: 'Abhinav',
    })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('email')
    expect(response.body.errors[0].message).toBe('Required')
  })
  test('Signup should fail when email provided is of incorrect format', async () => {
    const response = await request(app).post('/signup').send({
      email: 'abhinavgmail.com',
      password: '123456',
      name: 'Abhinav',
    })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('email')
    expect(response.body.errors[0].message).toBe('Invalid email')
  })
  test('Signup should fail when password not provided', async () => {
    const response = await request(app).post('/signup').send({
      email: 'abhinav@gmail.com',
      name: 'Abhinav',
    })
    expect(response.status).toBe(400)
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('password')
  })
  test('Signup should fail when password is too short', async () => {
    const response = await request(app).post('/signup').send({
      email: 'abhinav@gmail.com',
      password: '12345',
      name: 'Abhinav',
    })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('password')
    expect(response.body.errors[0].message).toBe(
      'String must contain at least 6 character(s)'
    )
  })
  test('Signup should fail when name not provided', async () => {
    const response = await request(app).post('/signup').send({
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeInstanceOf(Array)
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0].field).toBe('name')
    expect(response.body.errors[0].message).toBe('Required')
  })
  test('Signup should fail when user with email already exists', async () => {
    await authService.signupUser({
      name: 'Abhinav',
      email: 'abhinav@gmail.com',
      password: '123456',
    })
    const response = await request(app).post('/signup').send({
      email: 'abhinav@gmail.com',
      password: '123456',
      name: 'Abhinav',
    })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User already exists')
  })
  test('Signup should succeed for correct payload', async () => {
    const response = await request(app).post('/signup').send({
      email: 'abhinav@gmail.com',
      password: '123456',
      name: 'Abhinav',
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user.name).toBe('Abhinav')
    expect(response.body.user.email).toBe('abhinav@gmail.com')
  })
})
