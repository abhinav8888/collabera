import express from 'express'
import authenticationController from '../controllers/authenticationController'

const router = express.Router()

router.post('/login', authenticationController.login)
router.post('/register', authenticationController.signup)
