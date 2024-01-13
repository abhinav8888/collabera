import { type IBaseCollectionFields } from './base'

export interface User extends IBaseCollectionFields {
  name: string
  email: string
  password: string
}
