import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from 'containers/Html'
import { match, RouterContext } from 'react-router'
import routes from 'app/routes'
import createStore, { sagaMiddleware } from 'app/create-store'
import { Provider } from 'react-redux'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'
import authenticator from './authenticator'
import fs from 'fs'
import serverRender from '../utils/server-render'
import { initState as universalState } from 'reducers/universal-reducer'
import { setServerFetched, setAccessToken } from 'actions/universal-action'
import koa from 'koa'
import passport from 'koa-passport'
import router from 'koa-router'
import { fromJS } from 'immutable'
import path from 'path'
import { initState as appInitState } from 'reducers/app-reducer'
import PassportHelper from '../helpers/passport'

const assets = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../build/assets.json'), 'utf-8'))
const loginUrl = '/login'

const frontend = new koa()

frontend.use(function* (next) {
  if (/^\/api/.test(this.path)) {
    yield next
  } else {
    yield composeMiddleware(this, next, authenticate, initStore, global.config.universal? universalRender: nonUniversalRender)
  }
})

function composeMiddleware(ctx, next, ...middlewares) {
  let composed
  for (let i = middlewares.length - 1; i >= 0; i--) {
    if (!composed) {
      composed = middlewares[i].call(ctx, next)
    } else {
      composed = middlewares[i].call(ctx, composed)
    }
  }
  return composed
}

function* authenticate(next) {
  const ctx = this
  yield passport.authenticate('app', { session: false }, function* (err, user, info) {
    if (err) {
      this.throw(err)
      return
    }
    let permissions = PassportHelper.getPagePermissions(ctx.originalUrl)
    if (/^\/login/.test(ctx.originalUrl)) {
      yield next
    } else if (user === false) {
      ctx.redirect(`${loginUrl}?to=${ctx.originalUrl}`)
    } else if (permissions && !permissions.filter(p => user.scope.indexOf(p) >= 0).length > 0) {
      ctx.redirect(`${loginUrl}?to=${ctx.originalUrl}`)
    } else {
      ctx.state.user = user
      ctx.state.token = ctx.cookies.get(COOKIE_AUTH_TOKEN)
      yield next
    }
  }).call(this, next)
}

function* initStore(next) {
  const initState = {
    app: appInitState(),
    auth: fromJS({ ...this.state.user, token: this.state.token }),
    universal: universalState,
  }
  this.state.store = createStore(initState)
  yield next
}

function *universalRender(next) {
  const { store } = this.state
  const { token, isAuthenticated } = this.state
  const { auth } = store.getState()
  const userAgent = this.request.headers['user-agent']
  try {
    const component = yield matchRoutes(this.originalUrl, store, token)
    store.dispatch(setAccessToken(null))
    // material ui use js inline style, need to mock a navigator
    global.navigator = { userAgent: userAgent }
    this.body = renderToHtml(assets, component, store)
  } catch (ex) {
    if (ex.status != 401) { //unknown error occurs
      this.throw(ex, ex.status || 500)
      // this.throw(ex.message || 'interval server ERROR', ex.status || 500)
    }
    this.redirect(`${loginUrl}?to=${this.originalUrl}`)
  }
}

function *nonUniversalRender(next) {
  const validUrls = /^\/$|^\/index\.html$/i
  if (!validUrls.test(this.url)) {
    this.throw('Page not found', 404)
  } else {
    this.body = '<!doctype html>' +
      ReactDOM.renderToString(<Html assets={assets} store={this.state.store} />)
  }
}

/**
 * wrap the matching function in a co-style generator recognition
 * @param  {[type]} url   [description]
 * @param  {[type]} store [description]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
const matchRoutes = (url, store, token) => done => {
  match({ routes, location: url }, function (error, redirectLocation, renderProps) {
    if (error) {
      error = { message: 'Internal SERVER error', status: 500 , ...error }
      done(error, null)
    } else if (redirectLocation) {
      console.warn('redirectLocation in mathRoutes, might be something wrong')
      // is it possible to enter here?
      // ctx.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const { auth: authState } = store.getState()
      serverRender(renderProps)
        .then(isFetch => {
          const component =
            <Provider store={store}>
              <RouterContext {...renderProps}/>
            </Provider>
          if (isFetch === true) {
            // need to notify serverFetch is done => do not fetch at client side as startup
            store.dispatch(setServerFetched())
            return done(null, component)
          }
          else if (authState.get('tokenValid')) { // token valid but expired, need to fetch data at client side(refresh token)
            return done(null, component)
          }
          // failed to fetch data ... should check the auth state
          // const error = new Error('unauthorized')
          // error.status = 401
          // return done(error, null)
        })
        .catch(ex => {
          ex.status = ex.status || 500
          ex.message = ex.message || 'internal server error'
          done(ex, null)
        })
    } else {
      done({ status: 404, message: 'Not found' }, null)
    }
  })
}

function renderToHtml(assets, component, store) {
  return '<!doctype html>' +
    ReactDOM.renderToStaticMarkup(<Html assets={assets} component={component} store={store} />)
}

export default frontend
