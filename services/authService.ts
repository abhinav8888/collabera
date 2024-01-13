import bcrypt from 'bcrypt'
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { type InsertOneResult } from 'mongodb'
import { type User } from '../models/user'
import userRepository from '../repositories/userRepository'

const sercretKey = process.env.JWT_SECRET_KEY ?? 'json-secret-key'

// This is a middleware function that will be used to validate the token
export const AuthenticationMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  // Get the token from the header
  // Header format has to be in the format `Bearer <token>`
  const token: string[] | undefined = req.headers.authorization?.split(' ')
  if (token === undefined || token.length !== 2) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const decoded: User = jwt.verify(token[1], sercretKey) as User
    res.locals.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

export const generateToken = (user: User): string => {
  return jwt.sign(user, sercretKey)
}

type LoginReponse = {
  user: User
  token: string
}

export const login = async (
  email: string,
  password: string
): Promise<LoginReponse | null> => {
  const user: User | null = await userRepository.findOne({ email })
  if (user === null) {
    return null
  }
  const passwordMatch: boolean = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return null
  }
  return {
    user,
    token: generateToken(user),
  }
}

type SignupResponse = {
  user: User
}

type SignupRequest = {
  name: string
  email: string
  password: string
}

export const signupUser = async ({
  name,
  email,
  password,
}: SignupRequest): Promise<SignupResponse | null> => {
  const existingUser = await userRepository.findOne({ email })
  if (existingUser !== null) {
    return null
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const result: InsertOneResult<User> = await userRepository.insertOne({
    name,
    email,
    password: hashedPassword,
  })
  if (!result.acknowledged) {
    return null
  } else {
    return {
      user: { name, email, password: hashedPassword, _id: result.insertedId },
    }
  }
}