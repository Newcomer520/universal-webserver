import React, { Component } from 'react'
import { Link } from 'react-router'
import './App.less'

export default class App extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {

	}
	render() {
		const styles = require('./App.less')
		return (
			<div>
				{/*header*/}
				<div className={styles['header']}>
					<h1>React Hot Module Replacement Testing</h1>
					<ul className={styles['header-nav']}>
						<li className={styles['header-nav-item']}><Link to="/">Home</Link></li>
						<li className={styles['header-nav-item']}><Link to="/about">About</Link></li>
						<li className={styles['header-nav-item']}><Link to="/contact">Contact</Link></li>
						<li className={styles['header-nav-item']}><Link to="/dfetch">DFetch</Link></li>
						<li className={styles['header-nav-item']}><Link to="/protected">Protected Data</Link></li>
					</ul>
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


