import User from '@/domain/entities/user'

export default interface UserRepository {
  getUser: (whereParam: string) => Promise<User | undefined>
}
