import { EmailValidatorAdapter } from './email-validator-adapter.utils'
import validator from 'validator'

jest.mock( 'validator', () => ( {
  isEmail (): boolean {
    return true
  }
} ) )

const makeSutAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe( 'EmailValidator Adapter', () => {
  test( 'should be return false if EmailValidator return false', () => {
    const sut = makeSutAdapter()
    jest.spyOn( validator, 'isEmail' ).mockReturnValueOnce( false )
    const isValid = sut.isValid( 'invalid_email@outlook.com' )

    expect( isValid ).toBe( false )
  } )

  test( 'should be return true if EmailValidator return true', () => {
    const sut = makeSutAdapter()
    const isValid = sut.isValid( 'invalid_email@outlook.com' )

    expect( isValid ).toBe( true )
  } )

  test( 'should call validator with correcty email', () => {
    const sut = makeSutAdapter()
    const isEmailSpy = jest.spyOn( validator, 'isEmail' )
    sut.isValid( 'any_email@outlook.com' )

    expect( isEmailSpy ).toHaveBeenCalledWith( 'any_email@outlook.com' )
  } )
} )
