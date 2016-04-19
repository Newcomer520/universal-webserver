import router from 'koa-router'
import actualRouter from './actual'
import predictRouter from './predict'
import PassportHelper from 'server/helpers/passport'

const simulateRouter = new router()
simulateRouter.use(PassportHelper.allow('doctor'))
simulateRouter.use('/actual', actualRouter.routes())
simulateRouter.use('/predict', predictRouter.routes())

export default simulateRouter
