import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'

// containers
import Root from 'containers/Root'
import Home from 'containers/Home'
import FetchStatus from 'containers/FetchStatus'
import Login from 'containers/Login'
import NoMatch from 'containers/NoMatch'

export default (
	<Route path="/" component={Root}>
		<Route component={Home}>
			<IndexRoute component={FetchStatus}/>
		</Route>
		<Route path="login" component={Login}/>
		<Route path="*" component={NoMatch}/>
	</Route>
)
