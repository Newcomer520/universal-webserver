import router from 'koa-router'
import actualRouter from './actual'
import predictRouter from './predict'

const simulateRouter = new router()
simulateRouter.use('/actual', actualRouter.routes(), actualRouter.allowedMethods())
simulateRouter.use('/predict', predictRouter.routes(), predictRouter.allowedMethods())

export default simulateRouter
