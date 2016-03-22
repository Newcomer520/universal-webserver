import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { StaggeredMotion, spring } from 'react-motion'
import Path from 'paths-js/path'
import Line from 'components/Svg/Line'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class PredictLine extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		const { fitPoints, uprPoints, lwrPoints, lineStyles, ...rest } = this.props

		return (
			<g>
			<Line points={fitPoints} { ...rest } lineStyles={lineStyles} />
			<Line points={uprPoints} { ...rest } lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
			<Line points={lwrPoints} { ...rest } lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
			</g>
		)
	}
}
