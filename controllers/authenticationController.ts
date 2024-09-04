import type { Request, RequestHandler, Response } from 'express'
import * as authService from '../services/authService'
import { z } from 'zod'
import { formatZodError } from '../services/formattingService'

interface IAuthenticationController {
  login: RequestHandler
  signup: RequestHandler
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// use package for runtime validations on signup
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
})

export class AuthenticationController implements IAuthenticationController {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body)
      const response = await authService.login(email, password)
      if (response == null) {
        res.status(401).json({ errors: ['Invalid Credentials'] })
      } else {
        res.json(response)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = formatZodError(error)
        res.status(400).json({ errors })
      } else {
        res.status(500).json({ errors: ['Internal Server Error'] })
      }
    }
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = signupSchema.parse(req.body)
      const response = await authService.signupUser({ email, password, name })
      if ('error' in response) {
        res.status(response.status ?? 500).json({ error: response.error })
      } else {
        res.json(response)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = formatZodError(error)
        res.status(400).json({ errors })
      } else {
        res.status(500).json({ errors: ['Internal Server Error'] })
      }
    }
  }
}
