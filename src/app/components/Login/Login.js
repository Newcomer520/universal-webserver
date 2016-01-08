
import React, { Component, PropTypes } from 'react'
import { reducer as formReducer, reduxForm, initialize, reset } from 'redux-form'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { login } from 'actions/login-action'

// import comonents from material-ui
import NameInputbox from 'material-ui/lib/text-field'
import PasswordInputbox from 'material-ui/lib/text-field'
import LoginCard from 'material-ui/lib/card/card'
import CardMedia from 'material-ui/lib/card/card-media'
import CardTitle from 'material-ui/lib/card/card-title'
import LoginButton from 'material-ui/lib/raised-button'
import ResetButton from 'material-ui/lib/raised-button'

//Recaptcha
import Recaptcha from 'components/Recaptcha'

// react testing
import ReactTestUtils from 'react-addons-test-utils';

const hideAutoFillColorStyle = {
  WebkitBoxShadow: '0 0 0 1000px white inset'
}

const validate = (values, props) => {
	const errors = {}

	if (!values.userName && props.form.userName) {
		errors.userName = 'Required'
	}

	if (!values.password && props.form.password) {
		errors.password = 'Required'
	}
	return errors;
};

const mapStateToProps = (state) => {
	return {
		recaptcha_id: state.auth.recaptcha_id,
		recaptcha_response: state.auth.recaptcha_response,
		state : state.form
	}
}

export const fields = [ 'userName', 'password' ]
@connect( mapStateToProps, dispatch => ({ actions: bindActionCreators({ login, reset }, dispatch) }))
@reduxForm({ // <----- THIS IS THE IMPORTANT PART!
	form: 'login',                           // a unique name for this form
	fields, // all the fields in your form
	validate
})

export default class Login extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		actions: PropTypes.object
	}
	resetForm = (event) => {
		event.preventDefault()
		this.props.actions.reset('login')
	}
	// babel will auto bind this into array function
	handleSubmit = (event) => {
		const { actions: { login }, recaptcha_response, fields } = this.props
		event.preventDefault()
		let id = this.id.getValue(),
				pw = this.pw.getValue()

		login(id, pw, recaptcha_response)
		return false
	}
	verify_button_disable = () => {
		const { fields: { userName, password }, recaptcha_response } = this.props
		const is_input_not_ready = (!userName.visited || !password.visited || !!!recaptcha_response )
		const is_error_exist = !(!userName.error && !password.error)
		const is_login_button_disable = is_input_not_ready || is_error_exist

		return is_login_button_disable
	}
	render() {
		const { fields: { userName, password }, recaptcha_response } = this.props
		const styles = require('./login.css')
		const is_login_button_disable = this.verify_button_disable()

		return (
			<div className={styles['Login']} >
				<form className={styles['Login__form']} onSubmit={ this.handleSubmit }>
					<LoginCard>
						<CardMedia overlay={<CardTitle title="Login" subtitle="Please authenticate your account first."/>}>
							<img src="http://lorempixel.com/600/337/nature/"/>
						</CardMedia>
						<NameInputbox
							errorText={userName.error}
							inputStyle={hideAutoFillColorStyle}
							className={styles['Login__inputs']}
							{ ...userName }
							ref={ node => {this.id = node }}
							hintText="Input your user name"
							floatingLabelText="User name" />
						<br/>
						<PasswordInputbox
							errorText={password.error}
							inputStyle={hideAutoFillColorStyle}
							className={styles['Login__inputs']}
							{ ...password }
							ref={ node => {this.pw = node }}
							type="password"
							hintText="Input your user password"
							floatingLabelText="Password" />
						<br/>

						<Recaptcha className={styles['Login__recaptcha']} id="recaptcha00" siteKey="6LcSzRQTAAAAAClegBn5RBTiiRyDrYrRHvpwpcHF" callbackName="recaptchCallback" />

						<div className={styles['Login__buttons']}>
							<LoginButton disabled={is_login_button_disable} label="OK" primary={true} type="submit" />
							<ResetButton label="Reset" onClick={ this.resetForm } />
						</div>

					</LoginCard>
				</form>
			</div>
		)
	}
}
