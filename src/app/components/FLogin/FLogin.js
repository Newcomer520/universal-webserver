import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { login } from 'actions/login-action'

class FLogin extends Component {
	constructor(props) {
		super(props)
		this.onApiClick = this.onApiClick.bind(this)
	}
	onApiClick() {
		const { login } = this.props.actions
		login(this.id.value, this.pw.value)
	}
	render() {
		return (
				<div>
					ID <input ref={ node => {this.id = node }} type="text" defaultValue="user02"/><br/>
					Password <input ref={ node => {this.pw = node }} type="password" defaultValue="123123"/><br/>
					<button onClick={this.onApiClick} >login</button>
				</div>
		)
	}
}
FLogin.propTypes = {
	actions: React.PropTypes.object
}
export default connect(undefined, dispatch => ({ actions: bindActionCreators({ login }, dispatch) }))(FLogin)
