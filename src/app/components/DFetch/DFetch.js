import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(
	state => ({
		fetched: state.fetched,
		data: state.dummy.data
	})
)
export default class DFetch extends Component {
	componentWillMount() {
		console.log('dfetch component will mount')
	}
	render() {
		console.log(this.props.data)
		return (
			<div>
				<h1>Dummy Fetching</h1>
				<ul>
				{this.props.data.map(d => <li key={d.id}>{d.id}: {d.value}</li>)}
				</ul>
			</div>
		)
	}
}
