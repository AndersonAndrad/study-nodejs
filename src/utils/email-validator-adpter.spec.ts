import { EmailValidatorAdapter } from './email-validator.utils'

describe( 'EmailValidator Adapter', () => {
  test( 'should be return false if EmailValidator return false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid( 'invalid_email@outlook.com' )

    expect( isValid ).toBe( false )
  } )
} )
