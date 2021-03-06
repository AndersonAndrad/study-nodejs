import { AddAccount, EmailValidator, HttpRequest, HttpResponse } from './singup.protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http.helper'

import { Controller } from '../../protocols'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor ( emailValidator: EmailValidator, addAccount: AddAccount ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle ( httpRequest: HttpRequest ): Promise<HttpResponse> {
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

      const account = await this.addAccount.add( {
        name,
        email,
        password
      } )

      return success( account )
    } catch ( error ) {
      return serverError()
    }
  }
}
