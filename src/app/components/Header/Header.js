import React, { Component } from 'react'
import Radium from 'radium'
import { Link } from 'react-router'

@Radium
export default class extends Component {
	componentDidMount() {

	}
	componentWillUnmount() {

	}
	handleScroll(e) {

	}
	render() {
		return (
			<div style={styles.header}>
				<img style={styles.logo} src={'/static/tile.png'}/>
				<div style={styles.description}>A Solution for Universal Rendering</div>
				{/*<Link to="/login">
					<span>Login</span>
				</Link>
				<Link style={styles.signup} to="/signup">
					<span>Sign up</span>
				</Link>*/}

			</div>
		)
	}
}

const styles = {
	container: {
		width: '100%',
	},
	header: {
		position: 'fixed',
		zIndex: '999',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		minHeight: '70px',
		backgroundColor: 'lightblue',
		padding: '10px',
		boxSizing: 'border-box',
		boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)'
	},
	logo: {
		width: '50px',
		height: '50px',
		marginRight: 'auto'
	},
	description: {
		fontFamily: `"Segoe UI",Arial,sans-serif`,
		fontWeight: 'bolder',
		fontSize: '15px'
	},
	signup: {
		marginLeft: '20px'
	}
}
