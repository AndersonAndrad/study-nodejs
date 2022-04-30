import { EmailValidatorAdapter } from './email-validator.utils'
import validator from 'validator'

jest.mock( 'validator', () => ( {
  isEmail (): boolean {
    return true
  }
} ) )

describe( 'EmailValidator Adapter', () => {
  test( 'should be return false if EmailValidator return false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn( validator, 'isEmail' ).mockReturnValueOnce( false )
    const isValid = sut.isValid( 'invalid_email@outlook.com' )

    expect( isValid ).toBe( false )
  } )

  test( 'should be return true if EmailValidator return true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid( 'invalid_email@outlook.com' )

    expect( isValid ).toBe( true )
  } )
} )
