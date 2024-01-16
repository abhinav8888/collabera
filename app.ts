import cors from 'cors'
import dotenv from 'dotenv'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'

dotenv.config()

// eslint-disable-next-line import/first
import authRouter from './routers/authRouter'
// eslint-disable-next-line import/first
import customerRouter from './routers/customerRouter'
// eslint-disable-next-line import/first
import mongoClient from './services/mongoService'

const app = express()

// Enable CORS
app.use(cors())
app.use(express.json())
app.use('', authRouter)
app.use('/customers', customerRouter)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' })
})

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Error occurred')
  next()
})

// assume 404 since no middleware responded
app.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Resource not found', body: req.query })
})

const server = app.listen(3000, () => {
  void mongoClient.initiateConnection()
  console.log('Server is running on port 3000')
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  void mongoClient.closeConnection()
  server.close(() => {
    console.log('HTTP server closed')
  })
})

export { app, server }
