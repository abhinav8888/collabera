import { type ObjectId } from 'mongodb'

// base class to represent all collection documents in mongodb
// all classes representing a mongo collection should extend this class

export interface IBaseCollectionFields {
  _id: ObjectId
  createdAt?: Date
}
