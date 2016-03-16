import React, { Component } from 'react'
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import Header from 'components/Header'
import Radium from 'radium'
import RootCss from '../Root/Root.css'

@Radium
export default class Home extends Component {
	render() {
		const home = this
		return (
			<div style={styles.base}>
				<Header/>
				<div style={[styles.transitionContainer, { top: '70px' }]}>
					<ReactCSSTransitionGroup
						transitionAppear={false}
						transitionName={RootCss}
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}>
						<div key={this.props.location.pathname} style={styles.content}>
							{this.props.children}
						</div>
					</ReactCSSTransitionGroup>
				</div>
			</div>
		)
	}
}

const styles = {
	base: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	transitionContainer: {
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px'
	},
	content: {
		width: '100%',
		maxWidth: '1024px',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
}


