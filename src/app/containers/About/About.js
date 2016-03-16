import React, { Component } from 'react'

export default class About extends Component {
	state = {
		count: 0
	}
	add() {
		this.setState({
			count: this.state.count + 2
		})
	}
	render() {
		return (
			<div>
				<h1>About page</h1>
				<h2>{this.state.count}</h2>
				<button onClick={this.add.bind(this)}>add 2.0</button>
			</div>
		)
	}
}
