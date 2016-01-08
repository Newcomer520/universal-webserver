import React, { Component } from 'react'

// animation
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

export default class Root extends Component {
	render(){
		const styles = require('./root.css')
		return(
			<div className={'root'}>
				<ReactCSSTransitionGroup
					transitionAppear={true}
					transitionName={ styles }
					transitionEnterTimeout={800} transitionLeaveTimeout={500} transitionAppearTimeout={100} >
					<div key={this.props.location.pathname}>{this.props.children}</div>
				</ReactCSSTransitionGroup>
			</div>)
	}
}
