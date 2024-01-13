import express from 'express'
import cors from 'cors'
import { AuthenticationMiddleWare } from './services/authService'
import mongoClient from './services/mongoService'

const app = express()

// Enable CORS
app.use(cors())
app.use(express.json())
app.use(AuthenticationMiddleWare)

// Your routes and middleware go here

app.listen(3000, () => {
  void mongoClient.initiateConnection()
  console.log('Server is running on port 3000')
})
