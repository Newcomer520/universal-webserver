import router from 'koa-router'
import actualRouter from './actual'

const simulateRouter = new router()
simulateRouter.use('/actual', actualRouter.routes(), actualRouter.allowedMethods())


export default simulateRouter
