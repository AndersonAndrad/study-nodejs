import { DbAddAccount } from './db-add-account'

describe( 'DbAddAccount', () => {
  test( 'should call encrypter with correct password', async () => {
    class EncypterStub {
      async encrypt ( password: string ): Promise<string> {
        return await new Promise( resolve => resolve( 'hashed_password' ) )
      }
    }

    const encrypterStub = new EncypterStub()
    const sut = new DbAddAccount( encrypterStub )
    const encryptSpy = jest.spyOn( encrypterStub, 'encrypt' )
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }

    await sut.add( accountData )
    expect( encryptSpy ).toHaveBeenCalledWith( 'any_password' )
  }
  )
} )
