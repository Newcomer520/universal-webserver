import path from 'path'
import koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import mount from 'koa-mount'
import serve from 'koa-static'
import apiRouter from './api/index'
import errorHandler, { slackReportBot } from './middlewares/error-handler'
import morganLogger from './middlewares/logger'
import frontendRouter from './middlewares/router-middleware'
import co from 'co'
import timeout from 'koa-timeout'
import router from 'koa-router'

// application level init
co(function *() {

  // initial server setting

  const app = koa()
  // error handling asap
  app.use(errorHandler)
  app.use(timeout(1000 * 20))
  // app.use(slackReportBot)
  app.use(logger())
  app.use(morganLogger)
  app.use(bodyParser({
    onerror: (err, ctx) => ctx.throw('body parse error', 422)
  }))
  app.use(helmet())

  const apidoc = koa()
  apidoc.use(serve(path.join(__dirname, '../..', 'apidoc')))

  const statics = koa()
  statics.use(serve(path.join(__dirname, '../..', 'build/public')))
  app.use(mount('/static', statics))

  const appRouter = new router()

  appRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods())
  // mainly rendering
  app.use(mount('/', frontendRouter))
  app.use(appRouter.routes())
  app.use(appRouter.allowedMethods())

  if (global.__DEV__) {
    app.use(mount('/apidoc', apidoc))
  }



  const server = app.listen(global.config.port, () => {
    const host = server.address().address
    const port = server.address().port
    console.log('Server listening at http://%s:%s', host, port)
  })
})
