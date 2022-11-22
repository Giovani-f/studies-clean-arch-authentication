import Cpf from '@/domain/entities/cpf'

export default class User {
  constructor (
    readonly email: string,
    readonly name: string,
    readonly document: string,
    readonly password: string,
    readonly id: string
  ) {
    this.document = new Cpf(document).value
  }
}
