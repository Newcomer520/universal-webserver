import React, { Component, PropTypes } from 'react'

/**
 * Implement Google Recaptcha
 */
export default class Recaptcha extends Component {
	constructor(props) {
		super(props)
	}
	static propTypes = {
		id: PropTypes.string.isRequired,
		callbackName: PropTypes.string.isRequired,
		siteKey: PropTypes.string.isRequired
	}
	componentDidMount() {
		const { id, callbackName, siteKey } = this.props
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
				grecaptcha.render(id, options)
			}
		} else {
			grecaptcha.render(id, options)
		}
	}
	expiredCallback = () => {
		console.log('exppppppppppppired')
		if (window.grecaptcha) {
			// grecaptcha.reset(this.props.id)
		}
	}
	responseSuccessfully = (token) => {
		if (!this.props.onChange) {
			return
		}
		const e = { target: { target: token } }
	}
	render() {
		return (
			<div id={this.props.id} className="g-recaptcha" />
		)
	}
}
