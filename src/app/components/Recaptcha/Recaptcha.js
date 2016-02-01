import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { set_recaptcha_id } from 'actions/recaptcha-action'
import { get_recaptcha_response_success } from 'actions/recaptcha-action'
import { get_recaptcha_response_failed } from 'actions/recaptcha-action'

/**
 * Implement Google Recaptcha
 */
const mapStateToProps = (state) => {
	return { recaptcha_id: state.auth.recaptcha_id }
}
const actions_to_bind = { set_recaptcha_id, get_recaptcha_response_success, get_recaptcha_response_failed }
@connect( mapStateToProps, dispatch => ({ actions: bindActionCreators(actions_to_bind, dispatch) }))
export default class Recaptcha extends Component {
	constructor(props) {
		super(props)
	}
	static propTypes = {
		id: PropTypes.string.isRequired,
		callbackName: PropTypes.string.isRequired,
		siteKey: PropTypes.string.isRequired
	};
	componentDidMount() {
		const { id, callbackName, siteKey } = this.props
		const { set_recaptcha_id, get_recaptcha_response_failed } = this.props.actions
		let recaptcha_id;

		const options = {
			sitekey: siteKey,
			// callback: (this.props.verifyCallback) ? this.props.verifyCallback : undefined,
			// theme: this.props.theme,
			// type: this.props.type,
			// size: 'compact',
			// tabindex: this.props.tabindex,
			callback: this.responseSuccessfully,
			'expired-callback': this.expiredCallback
		}

		if (!window.grecaptcha) {
			window[callbackName] = () => {
				recaptcha_id = grecaptcha.render(id, options)
				set_recaptcha_id(recaptcha_id)
			}
		} else {
			recaptcha_id = grecaptcha.render(id, options)
			set_recaptcha_id(recaptcha_id)
		}

		// remove the previous response
		get_recaptcha_response_failed()
	}
	expiredCallback = () => {
		const { get_recaptcha_response_failed } = this.props.actions
		get_recaptcha_response_failed()
		console.log('exppppppppppppired')
		if (window.grecaptcha) {
			// grecaptcha.reset(this.props.id)
		}
	};
	responseSuccessfully = (token) => {
		const { get_recaptcha_response_success } = this.props.actions
		get_recaptcha_response_success(token)
		if (!this.props.onChange) {
			return
		}
		const e = { target: { target: token } }
	};
	render() {
		const { siteKey } = this.props
		const styles = require('./recaptcha.css')

		return (
			<div className={ styles['Recaptcha'] }>
				<div id={this.props.id} />
			</div>
		)
	}
}
