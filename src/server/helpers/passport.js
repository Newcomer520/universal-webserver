import { Strategy as LocalStrategy } from 'passport-local'
import co from 'co'
import authenticate, { RES_CODE_SUCCESS, RES_CODE_FAILED } from '../utils/free-radius'

export default class Passport {
  static loginLocal = (passport) => {
    passport.use('login-local', new LocalStrategy({ session: false }, (username, password, done) => {
      co(function* () {
        try {
          const response = yield authenticate(username, password)
          const authenticated = response.code === RES_CODE_SUCCESS
          const role = response.attributes['Reply-Message']
          const permissions = {
            admin: role === 'admin',
            doctor: role === 'admin' || role === 'doctor',
          }

          if (response.code === RES_CODE_SUCCESS) {
            done(null, { username, permissions })
          } else {
            done(null, false, 'incorrect username or password')
          }

        } catch (ex) {
          done(ex)
        }

      })
    }))
  };

  static jwt = (passport) => {

  };
}

