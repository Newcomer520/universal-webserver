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
import { setServerFetched } from 'actions/universal-action'
import koa from 'koa'
const assets = JSON.parse(fs.readFileSync('./build/assets.json', 'utf-8'))

const frontend = new koa()
frontend.use(function* (next) {
  if (/^\/api/.test(this.path)) {
    yield next
  } else {
    const middlewares = [authenticator, initStore, global.config.universal? universalRender: nonUniversalRender]
    let composed
    for (let i = middlewares.length - 1; i >= 0; i--) {
      if (!composed) {
        composed = middlewares[i].call(this, next)
      } else {
        composed = middlewares[i].call(this, composed)
      }
    }
    yield composed
  }
})

function* initStore(next) {
  const { userInfo } = this.state
  const initState = {
    auth: {
      isAuthenticated: userInfo.isAuthenticated,
      startAt: userInfo.startAt,
      expiresIn: userInfo.expiresIn,
      username: userInfo.username,
      tokenValid: userInfo.tokenValid,
      tokenExpired: userInfo.tokenExpired
    },
    universal: universalState
  }
  console.log(initState.auth)
  this.state.store = createStore(initState)
  yield next
}

function *universalRender(next) {
  const { store } = this.state
  const { token } = this.state
  const { auth } = store.getState()
  const loginUrl = '/login'
  const userAgent = this.request.headers['user-agent']
  try {
    const component = yield matchRoutes(this.originalUrl, store, token)
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
      serverRender(authState, renderProps, { token })
        .then(isFetch => {
          const component =
            <Provider store={store}>
              <RouterContext {...renderProps}/>
            </Provider>
          if (isFetch) {
            // need to notify serverFetch is done => do not fetch at client side as startup
            store.dispatch(setServerFetched())
            return done(null, component)
          }
          else if ( authState.tokenValid && authState.tokenExpired) { // token valid but expired, need to fetch data at client side(refresh token)
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
