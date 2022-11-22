import AuthenticationUseCase from '@/application/usecase/authentication'
import { HashComparer } from '@/domain/contracts/gateways/hash-comparer'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import UserRepository from '@/domain/contracts/repos/user-repository'
import { AuthenticationError } from '@/domain/entities/errors/autentication'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authentication', () => {
  let userRepository: MockProxy<UserRepository>
  let hashComparer: MockProxy<HashComparer>
  let crypto: MockProxy<TokenGenerator>
  let sut: AuthenticationUseCase
  beforeAll(() => {
    userRepository = mock()
    userRepository.getUser.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      document: 'any_document',
      name: 'any_name'
    })
    hashComparer = mock()
    hashComparer.compare.mockResolvedValue(true)
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new AuthenticationUseCase(userRepository, hashComparer, crypto)
  })

  test('Deve autenticar um usuário corretamente', async () => {
    await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(userRepository.getUser).toHaveBeenCalledWith('any_email')
    expect(userRepository.getUser).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar o token corretamente', async () => {
    const accessToken = await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(accessToken).toEqual({ token: 'any_generated_token' })
  })

  test('Deve retornar um erro ao tentar autenticar um usuário com email inválido', async () => {
    userRepository.getUser.mockResolvedValueOnce(undefined)

    const promise = sut.execute({ email: 'invalid_email', password: 'any_password' })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('Deve retornar o token corretamente', async () => {
    hashComparer.compare.mockResolvedValueOnce(false)
    const promise = sut.execute({ email: 'any_email', password: 'invalid_password' })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })
})
