import type { Request, RequestHandler, Response } from 'express'
import * as authService from '../services/authService'
import { z } from 'zod'

interface AuthenticationController {
  login: RequestHandler
  signup: RequestHandler
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const response = authService.login(email, password)
    if (response == null) {
      res.status(401).json({ error: 'Invalid Credentials' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' })
  }
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
})

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = signupSchema.parse(req.body)
    const response = authService.signupUser({ email, password, name })
    if (response == null) {
      res.status(401).json({ error: 'Invalid Credentials' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' })
  }
}

const authenticationController: AuthenticationController = {
  login,
  signup,
}

export default authenticationController
