import { MissingParamError } from '../errors/missing-param-error.error'
import { SingUpController } from './singup.controller'

const makeSut = (): SingUpController => {
  return new SingUpController()
}

describe( 'SingUp controller', () => {
  test( 'Should return 400 if no name is provied', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'anderson',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'name' ) )
  } )

  test( 'Should return 400 if no email is provied', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'email' ) )
  } )

  test( 'Should return 400 if no password is provied', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anderson@email.com',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'password' ) )
  } )

  test( 'Should return 400 if an invalid email ', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anderson@email.com',
        password: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'passwordConfirmation' ) )
  } )
} )
