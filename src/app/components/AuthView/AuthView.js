import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(
	state => ({ data: state.protectedData.data })
)
export default class AuthView extends Component {
	render() {
		const { data } = this.props
		return (
			<div>
				<h1>Protected Data Access</h1>
				<ul>
				{
					data.map((d, i) => <li key={i}>{d.value}</li>)
				}
				</ul>
			</div>
		)
	}
}
