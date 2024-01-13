import { type IBaseCollectionFields } from './base'

export interface Customer extends IBaseCollectionFields {
  name: string
  email: string
  age: number
}
