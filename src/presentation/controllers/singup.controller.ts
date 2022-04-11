import { HttpRequest, HttpResponse } from '../protocols/http.protocol'

import { Controller } from '../protocols/controllers.protocol'
import { MissingParamError } from '../errors/missing-param-error.error'
import { badRequest } from '../helpers/http.helper'

export class SingUpController implements Controller {
  handle ( httpRequest: HttpRequest ): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for ( const fields in requiredFields ) {
      if ( !httpRequest.body[requiredFields[fields]] ) {
        return badRequest( new MissingParamError( fields ) )
      }
    }
  }
}
