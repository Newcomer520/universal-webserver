import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login } from 'actions/dlogin-action'
import { pushPath } from 'redux-simple-router'
import Recaptcha from 'components/Recaptcha'

const { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_FAILED } = require('actions/dlogin-action').TYPES
@connect(
	state => ({
		status: state.auth.status,
		routing: state.routing,
		nextRouting: state.routing.state? state.routing.state.nextPathname: null
	}),
	dispatch => ({ actions: bindActionCreators({ login, pushPath }, dispatch) })
)
export default class DLogin extends Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	componentDidUpdate() {
		const { status, nextRouting, routing, location: { query: { to } }, actions: { pushPath } } = this.props
		console.log(nextRouting, routing)
		if (status === LOGIN_SUCCESS) {
			const nextPath = to? to: '/'
			pushPath(nextPath)
		}
	}
	handleSubmit(e) {
		const { actions: { login } } = this.props
		e.preventDefault()
		// console.log(this.refs.username.value, this.refs.password.value, grecaptcha.getResponse())
		login(this.refs.username.value, this.refs.password.value, grecaptcha.getResponse())
		return false
	}
	render() {
		const { status } = this.props
		const failed = <div style={{ color: 'red' }}>login failed</div>
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<div>
						<label>username</label>
						<input ref="username" type="text" name="username" />
					</div>
					<div>
						<label>password</label>
						<input ref="password" type="password" name="password" />
					</div>
					<Recaptcha id="recaptcha00" siteKey="6LcSzRQTAAAAAClegBn5RBTiiRyDrYrRHvpwpcHF" callbackName="recaptchCallback" />
					<div>
						<button type="submit">submit</button>
					</div>
					{ status == LOGIN_FAILED ? failed: null }
				</form>
			</div>
		)
	}
}
