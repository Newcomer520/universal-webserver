import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'

// components
import Root from 'components/Root'
import FetchStatus from 'components/FetchStatus'
import Login from 'components/Login'

export default (
	<Route path="/" component={Root}>
		<IndexRoute component={FetchStatus}/>
		<Route path="login" component={Login}/>
	</Route>
)
