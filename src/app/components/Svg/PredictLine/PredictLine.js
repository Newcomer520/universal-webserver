import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Path from 'paths-js/path'
import Line from 'components/Svg/Line'
import FillArea from 'components/Svg/FillArea'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class PredictLine extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render(){
		const { fitPoints, uprPoints, lwrPoints, lineStyles, fillStyles, ...rest } = this.props

		return (
			<g>
			<FillArea pointsUp={uprPoints} pointsBottom={lwrPoints} fillStyles={{...fillStyles}} {...rest} />
			<Line points={fitPoints} {...rest} lineStyles={lineStyles} />
			<Line points={uprPoints} {...rest} lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
			<Line points={lwrPoints} {...rest} lineStyles={{ ...lineStyles, strokeDasharray: "5,5" }} />
			</g>
		)
	}
}



