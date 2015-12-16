import React, { Component } from 'react'
import './App.less'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.count = this.count.bind(this)
	}
	state = {
		count: 10
	}
	count(num) {
		this.setState({
			count: this.state.count + num
		})
	}
	render() {
		const styles = require('./App.less')
		return (
			<div>
				<div className={styles.test}>
					total count: {this.state.count}
				</div>
				<button onClick={this.count.bind(this, 1)}>+1</button>
				<button onClick={this.count.bind(this, -1)}>-1</button>
			</div>
		)
	}
}