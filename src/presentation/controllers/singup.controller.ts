import { HttpRequest, HttpResponse } from '../protocols/http.protocol'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http.helper'

import { Controller } from '../protocols/controllers.protocol'
import { EmailValidator } from '../protocols/email-validator.protocol'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor ( emailValidator: EmailValidator ) {
    this.emailValidator = emailValidator
  }

  handle ( httpRequest: HttpRequest ): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for ( const fields in requiredFields ) {
        if ( !httpRequest.body[requiredFields[fields]] ) {
          return badRequest( new MissingParamError( fields ) )
        }
      }

      const isValid = this.emailValidator.isValid( httpRequest.body.email )

      if ( !isValid ) {
        return badRequest( new InvalidParamError( 'email' ) )
      }
    } catch ( error ) {
      return serverError()
    }
  }
}
