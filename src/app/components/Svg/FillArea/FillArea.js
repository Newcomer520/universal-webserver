import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Motion, spring } from 'react-motion'
import { linearInterpolator } from '../hack-spring100-to-linear'

export default class FillArea extends Component {
	updateStep = (x, currentStep, xArray) => {
		for (let i = 0; i < xArray.length - 1; i++) {
			if (x >= xArray[i] && x < xArray[i + 1]) {
				return i
			}
		}
		return xArray.length -1
	};

	getXArray = () => {
		const { pointsUp } = this.props
		return pointsUp.map((point, idx) => (point.x))
	};

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render(){
		const  { pointsUp, pointsBottom, xOffset, yOffset, fillStyles } = this.props
		let xArray = this.getXArray()
		let currentStep = 0
		let previousStep = 0
		return (
			<Motion
				defaultStyle={{ x: 0 }}
				style={{ x: spring(100, { stiffness: 100 }) }}>
				{
					value => {
						//-------------------------------------------------
						// calculate x and fill into xPositions array
						// it's a scaled value
						//-------------------------------------------------
						let fillArray = []

						let x = linearInterpolator(xArray, value.x, 100)  // xarray, current-value, stiffness <= third arg is stiffness, currently only 'default' and 100 is available
						currentStep = this.updateStep(x, currentStep, xArray)

						let xPositions = []
						pointsUp.forEach((pt,i) => {
							if( pointsUp[i].x < x) {
								xPositions.push(pointsUp[i].x)
							}
						})
						//-------------------------------------------------
						// draw the fill area by faux
						//-------------------------------------------------
						const vdom = ReactFauxDOM.createElement('g')

						const points = xPositions.map((point, idx) => (
							{ x: point, up: pointsUp[idx].y, lower: pointsBottom[idx].y }
						))

						let area = d3.svg.area()
						.x ((d) => (d.x))
						.y0((d) => (d.lower))
						.y1((d) => (d.up))

						d3.select(vdom)
						.attr('transform', `translate(${xOffset}, ${yOffset})`)
						.append('path')
						.datum(points)
						.attr('className', 'fillArea')
						.attr('d', area)
						.attr('opacity', fillStyles.opacity)
						.attr('fill', fillStyles.stroke)
						return (<g>{vdom.toReact()}</g>)
					}
				}
			</Motion>
		)
	}
}

