import router from 'koa-router'
import adminsRouter from './admins'
import authRouter from './auth'
import patientsRouter from './patients'
import searchesRouter from './searches'
import usersRouter from './users'

const apiRouter = new router()

apiRouter.use('/admins', adminsRouter.routes())
apiRouter.use('/auth', authRouter.routes())
apiRouter.use('/patients', patientsRouter.routes())
apiRouter.use('/searches', searchesRouter.routes())
apiRouter.use('/users', usersRouter.routes())

export default apiRouter
