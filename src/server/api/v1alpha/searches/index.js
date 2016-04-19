import router from 'koa-router'
import PassportHelper from 'server/helpers/passport'
import Schedules from './schedules'
import Overviews from './overviews'
import Abnormals from './abnormals'

const searchesRouter = new router()

searchesRouter.use(PassportHelper.allow('doctor'))

const schedules = new Schedules()
searchesRouter.get('/schedules', schedules.list)

const overviews = new Overviews()
searchesRouter.get('/overviews', overviews.fetch)

const abnormals = new Abnormals()
searchesRouter.get('/abnormals/:a_name', abnormals.fetch)

export default searchesRouter
