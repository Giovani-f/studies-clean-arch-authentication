import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/models/errors'

export interface Authentication {
  perform: (params: Authentication.Params) => Promise<Authentication.Result>
}

namespace Authentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
