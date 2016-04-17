import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'

// containers
import Root from 'containers/Root'
import Home from 'containers/Home'
import Login from 'containers/Login'
import Demo27 from 'containers/Demo27'
import NoMatch from 'containers/NoMatch'
import Patient from 'containers/Patient'

const Blank = props => <div/>

export default (
	<Route path="/" component={Root}>
		<Route component={Home}>
			<IndexRoute component={Blank}/>
			<Route path="patient" component={Patient}/>
			<Route path="simulate" component={Demo27}/>
			<Route path="dashboard" component={Blank}/>
			<Route path="record" component={Blank}/>
			<Route path="examination" component={Blank}/>
		</Route>
		<Route path="login" component={Login}/>
		<Route path="*" component={NoMatch}/>
	</Route>
)
