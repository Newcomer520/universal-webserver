import React, { Component } from 'react'
import { browserHistory } from 'react-router'

export default class extends Component {
	state = {
		countDown: 5
	};
	componentDidMount() {
		this.timer = setInterval(() => this.setState({ countDown: --this.state.countDown }), 1000)

	}
	componentDidUpdate() {
		if (this.state.countDown <= 0) {
			clearInterval(this.timer)
			this.timer = null
			setTimeout(() => browserHistory.push('/'), 500)
		}
	}
	componentWillUnmount() {
		this.timer && clearInterval(this.timer)
	}
	render() {
		const style = {
			marginLeft: 'auto',
			marginRight: 'auto',
			height: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center'
		}

		return (
			<div style={style}>
				<h2>Cannt goto "{this.props.location.pathname}", redirect to the default page in {this.state.countDown} seconds.</h2>
			</div>
		)
	}
}

