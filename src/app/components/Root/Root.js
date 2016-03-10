import React, { Component } from 'react'

// animation
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import styles from './Root.css'

export default class Root extends Component {
	render() {
		return(
			<div className={styles.root}>
				<ReactCSSTransitionGroup
					transitionAppear={false}
					transitionName={ styles }
					transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					<div className={styles.root__container} key={this.props.location.pathname}>{this.props.children}</div>
				</ReactCSSTransitionGroup>
			</div>)
	}
}
