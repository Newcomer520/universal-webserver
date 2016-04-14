import React from 'react'
import ReactDOM from 'react-dom'
import routes from './routes/index'
import createStore from './create-store'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { renderRouterContext } from './utils/universal'
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

// const createHistory = __UNIVERSAL__ === false ? require('history/lib/createHashHistory') : require('history/lib/createBrowserHistory')

const store = createStore(window.__reduxState__) // __reduxState__ will be valid if universal rendering
const history = syncHistoryWithStore(browserHistory, store, { adjustUrlOnReplay: false })
const component = (
  <Provider store={store}>
    <Router history={history} render={renderRouterContext(store)}>
      {routes}
    </Router>
  </Provider>
)

ReactDOM.render(
  component,
  document.getElementById('react-container')
)
