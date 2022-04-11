import { HttpRequest, HttpResponse } from '../protocols/http.protocol'

import { Controller } from '../protocols/controllers.protocol'
import { EmailValidator } from '../protocols/email-validator.protocol'
import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param-error.error'
import { badRequest } from '../helpers/http.helper'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor ( emailValidator: EmailValidator ) {
    this.emailValidator = emailValidator
  }

  handle ( httpRequest: HttpRequest ): HttpResponse {
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
  }
}
