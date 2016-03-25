import koa from 'koa'
import router from 'koa-router'
import loginRouter from './login'
import refreshTokenRouter from './refresh-token'
import logoutRouter from './logout'
import statusRouter from './status'
import simulateRouter from './simulate'

const apis = koa()
const apiRouter = router()

apiRouter.use('/login', loginRouter.routes(), loginRouter.allowedMethods())
apiRouter.use('/logout', logoutRouter.routes())
apiRouter.use('/refreshtoken', refreshTokenRouter.routes())
apiRouter.use('/status', statusRouter.routes(), statusRouter.allowedMethods())

// simulate
apiRouter.use('/simulate', simulateRouter.routes(), simulateRouter.allowedMethods())


apis.use(apiRouter.routes(), apiRouter.allowedMethods())



export default apis
