import { type ObjectId } from 'mongodb'

// base class to represent all collection documents in mongodb
export interface IBaseCollectionFields {
  _id: ObjectId
  createdAt?: Date
}
