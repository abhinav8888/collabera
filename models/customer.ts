import { type IBaseCollectionFields } from './base'

// model to represent Customer table in mongo
export interface Customer extends IBaseCollectionFields {
  name: string
  email: string
  age: number
}

