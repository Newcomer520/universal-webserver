import React, { Component } from 'react'
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import Header from 'components/Header'
import styles from './home.css'
import RootCss from '../Root/Root.css'

export default class Home extends Component {
	render() {
		return (
			<div className={styles.base}>
				<Header/>
				<ReactCSSTransitionGroup
					transitionAppear={false}
					transitionAppearTimeout={500}
					transitionName={RootCss}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					<div key={this.props.location.pathname} className={styles['transition-container']}>
						<div className={styles.content}>
							{this.props.children}
						</div>
					</div>
				</ReactCSSTransitionGroup>

			</div>
		)
	}
}
