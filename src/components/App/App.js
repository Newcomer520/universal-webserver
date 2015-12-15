import React, { Component } from 'react'
import './App.less'
export default class App extends Component {
	render() {
		const styles = require('./App.less')
		return <div className={styles.test}>OK Ap1p</div>
	}
}