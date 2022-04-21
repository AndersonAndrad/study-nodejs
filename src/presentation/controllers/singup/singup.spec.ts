import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from './singup.protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

import { SingUpController } from './singup.controller'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SingUpController( emailValidatorStub, addAccountStub )
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid ( email: string ): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add ( account: AddAccountModel ): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return await new Promise( resolve => resolve( fakeAccount ) )
    }
  }

  return new AddAccountStub()
}

describe( 'SingUp controller', () => {
  test( 'Should return 400 if no name is provied', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'anderson',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'name' ) )
  } )

  test( 'Should return 400 if no email is provied', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'email' ) )
  } )

  test( 'Should return 400 if no password is provied', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anderson@email.com',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'password' ) )
  } )

  test( 'Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anderson@email.com',
        password: '123456',
        passwordConfirmation: '12345'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new InvalidParamError( 'passwordConfirmation' ) )
  } )

  test( 'Should return 400 if an invalid email ', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anderson@email.com',
        password: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new MissingParamError( 'email' ) )
  } )

  test( 'Should return 400 if an invalid email is provied ', async () => {
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

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 400 )
    expect( httpResponse?.body ).toEqual( new InvalidParamError( 'email' ) )
  } )

  test( 'Should return 500 if EmailValidator throws ', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn( emailValidatorStub, 'isValid' ).mockImplementationOnce( async () => {
      return await new Promise( ( resolve, reject ) => reject( new Error() ) )
    } )

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'invalid@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 500 )
    expect( httpResponse?.body ).toEqual( new ServerError() )
  } )

  test( 'Should return 500 if AddAccount throws ', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn( addAccountStub, 'add' ).mockImplementationOnce( () => {
      throw new Error()
    } )

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'invalid@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 500 )
    expect( httpResponse?.body ).toEqual( new ServerError() )
  } )

  test( 'Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn( emailValidatorStub, 'isValid' )

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anyEmailForTest@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    await sut.handle( httpRequest )

    expect( isValidSpy ).toHaveBeenCalledWith( 'anyEmailForTest@email.com' )
  } )

  test( 'Should call AddAcoount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn( addAccountStub, 'add' )

    const httpRequest = {
      body: {
        name: 'anderson',
        email: 'anyEmailForTest@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    await sut.handle( httpRequest )

    expect( addSpy ).toHaveBeenCalledWith( {
      name: 'anderson',
      email: 'anyEmailForTest@email.com',
      password: '123456'
    } )
  } )

  test( 'Should return 200 if an valid data is provied ', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valird_name',
        email: 'valid@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle( httpRequest )

    expect( httpResponse?.statusCode ).toBe( 200 )
    expect( httpResponse?.body ).toEqual( {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    } )
  } )
} )
