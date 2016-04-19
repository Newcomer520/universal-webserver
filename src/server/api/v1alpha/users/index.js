import router from 'koa-router'
import PassportHelper from 'server/helpers/passport'
import Profiles from './profiles'

const usersRouter = new router()

usersRouter.use(PassportHelper.allow('doctor'))

const profiles = new Profiles()
usersRouter.get('/profiles', profiles.fetch)

export default usersRouter
