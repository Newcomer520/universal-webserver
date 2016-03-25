import React, { Component } from 'react'

// animation
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import styles from './Root.css'
import transionStyles from './Root.css'
import 'react-select/dist/react-select.css'
import Select from 'react-select'
import CSSModules from 'react-css-modules'
import { connect } from 'react-redux'

@connect(
	state => ({ isBusy: state.app.get('isBusy') })
)
@CSSModules(styles)
export default class Root extends Component {
	render() {
		// const isBusy = false
		const { isBusy } = this.props
		return(
			<div styleName={isBusy? "root-loading" : "root"}>
				<ReactCSSTransitionGroup
					transitionAppear={false}
					transitionName={transionStyles}
					transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					<div
						styleName="container"
						key={this.props.children.type.displayName || this.props.children.type.name}>
						{this.props.children}
					</div>
				</ReactCSSTransitionGroup>
				{isBusy ? <div className="ui active large loader"></div> : null}
			</div>
		)
	}
}
