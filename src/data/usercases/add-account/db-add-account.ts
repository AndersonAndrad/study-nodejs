import { AddAccount, AddAccountModel } from '../../../domain/usercases/add-account.usercase'

import { AccountModel } from '../../../domain/models/account.model'
import { Encrypter } from '../../protocols/encrypter.protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor ( encrypter: Encrypter ) {
    this.encrypter = encrypter
  }

  async add ( account: AddAccountModel ): Promise<AccountModel> {
    await this.encrypter.encrypt( account.password )
    return await new Promise( resolve => resolve( new AccountModel() ) )
  }
}
