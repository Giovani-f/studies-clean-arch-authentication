import User from '@/domain/entities/user'

describe('User', () => {
  test('Deve criar um usuário com cpf válido', () => {
    expect(() => new User('giovani@email.com', 'giovani', '821.264.240-22', '123', '1')).not.toThrow()
  })

  test('Não deve criar um usuário com cpf inválido', () => {
    expect(() => new User('giovani@email.com', 'giovani', '821.264.240-21', '123', '1')).toThrow()
  })
})
