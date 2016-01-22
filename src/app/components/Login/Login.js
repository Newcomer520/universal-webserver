
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

const hideAutoFillColorStyle = {
	WebkitBoxShadow: '0 0 0 1000px white inset'
}

const validate = (values, props) => {
	const errors = {}

	if (!values.userName) {
		errors.userName = 'Username is required'
	}

	if (!values.password) {
		errors.password = 'Password is required'
	}
	return errors;
};

const mapStateToProps = (state) => {
	return {
		recaptcha_id: state.auth.recaptcha_id,
		recaptcha_response: state.auth.recaptcha_response,
		is_btn_disable: state.auth.is_btn_disable,
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

	constructor(props) {
		super(props)
		this.state = {
			is_login_click: false
		}
	}

	resetForm = (event) => {
		event.preventDefault()
		this.setState({ is_login_click: false })
		this.props.actions.reset('login')
	}

	// babel will auto bind this into array function
	handleSubmit = (event) => {
		const { actions: { login, login_btn_click }, recaptcha_response, fields: { userName, password } } = this.props
		event.preventDefault()

		this.setState({ is_login_click: true })
		// workaround for material-ui conflict with chrome's autofill
		this.id.focus()
		this.id.blur()
		this.pw.focus()
		this.pw.blur()

		// useing !! trun error to true and false, then NOT the error means valid
		const is_username_valid = !!!userName.error
		const is_password_valid = !!!password.error
		const is_get_recaptcha_response = !!this.is_get_recaptcha_response()

		if(is_username_valid && is_password_valid && is_get_recaptcha_response){
			login(this.id.getValue(), this.pw.getValue(), recaptcha_response)
		}

		return false
	}

	is_get_recaptcha_response = () => {
		const { recaptcha_response } = this.props
		const get_response = !!recaptcha_response
		return get_response
	}

	render() {
		const { fields: { userName, password }, recaptcha_response } = this.props
		const styles = require('./login.css')
		const is_errors_display = this.state.is_login_click
		let underline_style, recaptcha_error_txt_style, username_error_text, password_error_text

		// error message style for recaptcha
		if( !this.is_get_recaptcha_response() && is_errors_display ){
			underline_style = styles['Login__red-underline']
			recaptcha_error_txt_style = styles['Login__error-text']
		} else {
			underline_style = styles['Login__red-underline--hide']
			recaptcha_error_txt_style = styles['Login__error-text--hide']
		}

		// error message for username and password
		if( is_errors_display ){
			username_error_text = userName.error
			password_error_text = password.error
		}

		return (
			<div className={styles['Login']} >
				<form className={styles['Login__form']} onSubmit={this.handleSubmit}>
					<LoginCard>
						<CardMedia overlay={<CardTitle title="Login" subtitle="Please authenticate your account first."/>}>
							<div className={styles['Login__banner']}></div>
						</CardMedia>
						<NameInputbox
							errorText={username_error_text}
							inputStyle={hideAutoFillColorStyle}
							className={styles['Login__inputs']}
							{ ...userName }
							ref={ node => {this.id = node }}
							hintText="Input your user name"
							floatingLabelText="User name" />
						<br/>
						<PasswordInputbox
							errorText={password_error_text}
							inputStyle={hideAutoFillColorStyle}
							className={styles['Login__inputs']}
							{ ...password }
							ref={ node => {this.pw = node }}
							type="password"
							hintText="Input your user password"
							floatingLabelText="Password" />
						<br/>
						<Recaptcha
							className={styles['Login__recaptcha']}
							id="recaptcha00"
							siteKey="6LcSzRQTAAAAAClegBn5RBTiiRyDrYrRHvpwpcHF"
							callbackName="recaptchCallback" />
						<div className={styles['Login__box']}>
							<hr className={styles['Login__gray-underline']}/>
							<hr className={underline_style}/>
						</div>
						<div className={recaptcha_error_txt_style}>reCaptcha is required</div>
						<br />
						<div className={styles['Login__buttons']}>
							<LoginButton disabled={this.props.is_btn_disable} label="OK" primary={true} type="submit" />
							<ResetButton disabled={this.props.is_btn_disable} label="Reset" onClick={ this.resetForm } />
						</div>
					</LoginCard>
				</form>
			</div>
		)
	}
}
