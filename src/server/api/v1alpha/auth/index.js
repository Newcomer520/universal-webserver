import router from 'koa-router'
import passport from 'koa-passport'
import authenticator from 'server/middlewares/authenticator'
import Login from './login'
import Logout from './logout'
import Refresh from './refresh'

const authRouter = new router()

const login = new Login()
authRouter.post('/login', login.jwt)

authRouter.use('/logout', authenticator)
const logout = new Logout()
authRouter.post('/logout', logout.jwt)

authRouter.use('/refresh', passport.authenticate('app', { session: false }))
const refresh = new Refresh()
authRouter.post('/refresh', refresh.jwt)

export default authRouter
