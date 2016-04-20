import router from 'koa-router'
import apiRouterV0 from './v0/index'
import apiRouterV1 from './v1alpha/index'

const apiRouter = new router()

apiRouter.use('/v0', apiRouterV0.routes(), apiRouterV0.allowedMethods())
apiRouter.use(`/${__API_VERSION__}`, apiRouterV1.routes(), apiRouterV1.allowedMethods())

export default apiRouter
