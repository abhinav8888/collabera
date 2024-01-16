import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoClinet from '../services/mongoService'

let mongoServer: MongoMemoryServer
export const startMongoMemoryServer = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create()
  await mongoClinet.connect(mongoServer.getUri())
}

export const stopMongoMemoryServer = async (): Promise<void> => {
  await mongoServer.stop()
}

export const clearDatabase = async (): Promise<void> => {
  await mongoClinet.db?.dropDatabase()
}
