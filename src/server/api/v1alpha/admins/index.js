import router from 'koa-router'
import PassportHelper from 'server/helpers/passport'
import Logs from './logs'
import Modules from './modules'
import Settings from './settings'
import About from './about'
import Serials from './serials'

const adminsRouter = new router()
adminsRouter.use(PassportHelper.allow('admin'))

const log = new Logs()
adminsRouter.get('/logs', log.fetch)

const modules = new Modules()
adminsRouter.get('/modules', modules.list)
adminsRouter.post('/modules', modules.import)

const settings = new Settings()
adminsRouter.get('/settings', settings.fetch)
adminsRouter.put('/settings', settings.update)

const about = new About()
adminsRouter.get('/about', about.fetch)

const serials = new Serials()
adminsRouter.get('/serials', serials.fetch)
adminsRouter.put('/serials', serials.update)

export default adminsRouter
