import test from 'ava'
import koa from 'koa'
test('server dependencies should be fine.', t => {
  const app = require('server/server-preloader')
  t.truthy(app instanceof koa, "app should be an instance of koa")
})
