import { type ObjectId } from 'mongodb'

export interface IBaseCollectionFields {
  _id: ObjectId
  createdAt?: Date
}
