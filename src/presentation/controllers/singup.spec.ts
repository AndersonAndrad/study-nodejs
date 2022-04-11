import { SingupController } from './singup.controller'

describe( 'SingUp controller', () => {
  test( 'Should return 400 if no name is provied', () => {
    const sut = new SingupController()

    const httpRequest = {
      body: {
        email: 'anderson',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse.statusCode ).toBe( 400 )
    expect( httpResponse.body ).toEqual( new Error( 'Missing param: name' ) )
  } )
} )
