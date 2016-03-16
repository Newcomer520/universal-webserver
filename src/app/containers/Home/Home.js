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
				<div style={[styles.content, { top: '70px' }]}>
					<ReactCSSTransitionGroup
						transitionAppear={false}
						transitionName={RootCss}
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}>
						<div key={home.props.location.pathname}>
							{home.props.children}
						</div>
						{/*React.cloneElement(home.props.children, { key: home.props.location.pathname })*/}
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
	content: {
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px'
	}
}


