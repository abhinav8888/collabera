import type { Filter, FindOptions, Document, WithId } from 'mongodb'
import type { User } from '../models/user'
import BaseRepository from './baseRepository'

class UserRepository extends BaseRepository<User> {
  collectionName: string = 'users'

  async findOne(
    filter: Filter<User>,
    options?: FindOptions<Document> | undefined
  ): Promise<WithId<User> | null> {
    if (options === undefined) {
      options = { projection: { password: 0 } }
    }
    return await super.findOne(filter, options)
  }
}

const userRepository = new UserRepository()
export default userRepository
