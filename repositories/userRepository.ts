import type { User } from '../models/user'
import BaseRepository from './baseRepository'

class UserRepository extends BaseRepository<User> {
  collectionName: string = 'users'
}

const userRepository = new UserRepository()
export default userRepository
