import { HashComparer } from '@/domain/contracts/gateways/hash-comparer'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import UserRepository from '@/domain/contracts/repos/user-repository'
import { AccessToken } from '@/domain/entities/access-token'
import { AuthenticationError } from '@/domain/entities/errors/autentication'

export default class AuthenticationUseCase {
  constructor (
    readonly userRepository: UserRepository,
    readonly hashComparer: HashComparer,
    readonly token: TokenGenerator
  ) {}

  async execute (params: Authentication.Input): Promise<Authentication.Output> {
    const user = await this.userRepository.getUser(params.email)
    if (!user) throw new AuthenticationError()
    const isValidPassword = await this.hashComparer.compare(params.password, user.password)
    if (!isValidPassword) throw new AuthenticationError()
    const accessToken = await this.token.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
    return { token: accessToken }
  }
}

export namespace Authentication {
  export type Input = {
    email: string
    password: string
  }

  export type Output = {
    token: string
  } | Error
}
