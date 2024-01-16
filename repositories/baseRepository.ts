import type {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
  Collection,
  DeleteResult,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertManyResult,
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  WithId,
  WithoutId,
} from 'mongodb'
import { type IBaseCollectionFields } from '../models/base'
import mongoConnectionManager from '../services/mongoService'

export default abstract class BaseRepository<T extends IBaseCollectionFields> {
  collection: Collection<T> | null = null
  abstract collectionName: string
  getCollection = async (): Promise<Collection<T>> => {
    if (this.collection === null) {
      this.collection = await mongoConnectionManager.getCollection<T>(
        this.collectionName
      )
    }
    return this.collection
  }

  getCollectionForInsert = async (): Promise<Collection<WithoutId<T>>> => {
    return await mongoConnectionManager.getCollection<WithoutId<T>>(
      this.collectionName
    )
  }

  async findOne(
    filter: Filter<T>,
    options?: FindOptions
  ): Promise<WithId<T> | null> {
    const collection: Collection<T> = await this.getCollection()
    if (options !== undefined) {
      return await collection.findOne(filter, options)
    }
    return await collection.findOne(filter)
  }

  async findByIdAndUpdate(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options: FindOneAndUpdateOptions = { returnDocument: 'after' }
  ): Promise<WithId<T> | null> {
    const collection: Collection<T> = await this.getCollection()
    return await collection.findOneAndUpdate(filter, update, options)
  }

  async find(
    filter: Filter<T>,
    options?: FindOptions
  ): Promise<Array<WithId<T>>> {
    const collection: Collection<T> = await this.getCollection()
    if (options !== undefined) {
      if (options.limit !== undefined && isNaN(options.limit)) {
        options.limit = 25
      }
      return await collection.find(filter, options).toArray()
    }
    return await collection.find(filter).toArray()
  }

  async insertOne(
    body: OptionalUnlessRequiredId<WithoutId<T>>
  ): Promise<InsertOneResult<T>> {
    const collection: Collection<WithoutId<T>> =
      await this.getCollectionForInsert()
    if (body.createdAt === undefined) {
      body.createdAt = new Date()
    }
    return await collection.insertOne(body)
  }

  insertMany = async (
    body: Array<OptionalUnlessRequiredId<T>>
  ): Promise<InsertManyResult<T>> => {
    const collection: Collection<T> = await this.getCollection()
    body.forEach((item) => {
      if (item.createdAt === undefined) {
        item.createdAt = new Date()
      }
    })
    return await collection.insertMany(body)
  }

  bulkWrite = async (
    operations: Array<AnyBulkWriteOperation<T>>,
    options?: BulkWriteOptions | undefined
  ): Promise<BulkWriteResult> => {
    const collection: Collection<T> = await this.getCollection()
    return await collection.bulkWrite(operations, options)
  }

  deleteOne = async (filter: Filter<T>): Promise<DeleteResult> => {
    const collection: Collection<T> = await this.getCollection()
    return await collection.deleteOne(filter)
  }

  deleteMany = async (filter: Filter<T>): Promise<DeleteResult> => {
    const collection: Collection<T> = await this.getCollection()
    return await collection.deleteMany(filter)
  }

  updateMany = async (
    filter: Filter<T>,
    update: UpdateFilter<T>,
    options?: UpdateOptions
  ): Promise<Promise<UpdateResult<T>>> => {
    const collection: Collection<T> = await this.getCollection()
    return await collection.updateMany(filter, update, options)
  }
}
