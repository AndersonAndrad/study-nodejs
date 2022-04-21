import { AddAccount, EmailValidator, HttpRequest, HttpResponse } from './singup.protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http.helper'

import { Controller } from '../../protocols'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor ( emailValidator: EmailValidator, addAccount: AddAccount ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle ( httpRequest: HttpRequest ): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for ( const fields in requiredFields ) {
        if ( !httpRequest.body[requiredFields[fields]] ) {
          return badRequest( new MissingParamError( fields ) )
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if ( password !== passwordConfirmation ) {
        return badRequest( new InvalidParamError( 'passwordConfirmation' ) )
      }

      const isValid = this.emailValidator.isValid( email )

      if ( !isValid ) {
        return badRequest( new InvalidParamError( 'email' ) )
      }

      this.addAccount.add( {
        name,
        email,
        password
      } )
    } catch ( error ) {
      return serverError()
    }
  }
}
