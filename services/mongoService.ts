import { type Collection, type Db, MongoClient } from 'mongodb'

/**
 * Main class to manage connections to mongo.
 * Use singleton pattern to ensure only one connection is established
 */
class MongoConnectionManager {
  private readonly connectionUri: string

  private client: MongoClient

  dbName: string

  public db: Db | null = null

  /**
   * Constructor to initialize class and establish connection
   */
  constructor() {
    this.connectionUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017'
    this.dbName = process.env.DATABASE_NAME ?? 'customers'
    this.client = new MongoClient(this.connectionUri, {
      ignoreUndefined: true,
    })
  }

  async initiateConnection(): Promise<void> {
    await this.client.connect()
  }

  async connect(connectionUri: string): Promise<void> {
    this.client = new MongoClient(connectionUri, { ignoreUndefined: true })
    this.dbName = process.env.DATABASE_NAME ?? 'customers'
    await this.client.connect()
    this.db = this.client.db(this.dbName)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCollection<TSchema extends Record<string, any>>(
    collectionName: string
  ): Promise<Collection<TSchema>> {
    if (this.db === null) {
      this.db = this.client.db(this.dbName)
    }
    return this.db.collection(collectionName)
  }

  async getClient(): Promise<MongoClient> {
    return this.client
  }

  async closeConnection(): Promise<void> {
    await this.client.close()
  }
}

const mongoConnectionManager = new MongoConnectionManager()

export default mongoConnectionManager
