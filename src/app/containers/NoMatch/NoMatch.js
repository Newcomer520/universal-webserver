import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Radium from 'radium'

@Radium
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
			setTimeout(() => browserHistory.push('/'), 500)
		}
	}
	render() {
		return (
			<div style={styles.base}>
				<h2>Cannt goto "{this.props.location.pathname}", redirect to the default page in {this.state.countDown} seconds.</h2>
			</div>
		)
	}
}

const styles = {
	base: {
		marginLeft: 'auto',
		marginRight: 'auto',
		height: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center'
	}
}
