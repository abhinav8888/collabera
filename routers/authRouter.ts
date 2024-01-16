import express from 'express'
import { AuthenticationController } from '../controllers/authenticationController'

const router = express.Router()
const authenticationController = new AuthenticationController()

router.post('/login', authenticationController.login)
router.post('/signup', authenticationController.signup)

export default router
