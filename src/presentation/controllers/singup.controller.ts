import { HttpRequest, HttpResponse } from '../protocols/http'

import { MissingParamError } from '../errors/missing-param-error.error'
import { badRequest } from '../helpers/http.helper'

export class SingUpController {
  handle ( httpRequest: HttpRequest ): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for ( const fields in requiredFields ) {
      if ( !httpRequest.body[requiredFields[fields]] ) {
        return badRequest( new MissingParamError( fields ) )
      }
    }
  }
}
