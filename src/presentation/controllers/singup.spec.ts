import { EmailValidator } from '../protocols/email-validator.protocol'
import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param-error.error'
import { SingUpController } from './singup.controller'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid ( email: string ): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SingUpController( emailValidatorStub )
  return {
    sut,
    emailValidatorStub
  }
}

describe( 'SingUp controller', () => {
  test( 'Should return 400 if no name is provied', () => {
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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

  test( 'Should return 400 if an invalid email is provied ', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn( emailValidatorStub, 'isValid' ).mockReturnValueOnce( false )

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'invalid@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new InvalidParamError( 'email' ) )
  } )
} )
