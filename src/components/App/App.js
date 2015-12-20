import React, { Component } from 'react'
import './App.less'

export default class App extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const styles = require('./App.less')
		return (
			<div>
				{/*header*/}
				<div>
					<h1>React Hot Module Replacement Testing</h1>
				</div>
				<div>
					{ this.props.children? this.props.children: 'empty content' }
				</div>
				{/*footer*/}
				<div>
					<h1>footer</h1>
				</div>
			</div>
		)
	}
}
