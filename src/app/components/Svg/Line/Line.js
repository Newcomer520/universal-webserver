import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import Path from 'paths-js/path'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import style from './style.css'
import { linearInterpolator } from '../hack-spring100-to-linear'

export default class Line extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	genLineFunctions = () => {
		const { points } = this.props
		const lines = points.map((point, idx)=>{
			let  x1, y1, x2, y2
			x1 = points[idx].x
			y1 = points[idx].y
			if (idx + 1 === points.length) {
				x2 = points[idx].x
				y2 = points[idx].y
			} else {
				x2 = points[idx + 1].x
				y2 = points[idx + 1].y
			}

			return (
				(x) => {
					let m = 1
					if(x2 - x1 === 0){
						m = 0
					}else{
						m = (y2 - y1) / (x2 - x1)
					}
					return (m * (x - x1) + y1)
				}
			)
		})
		return lines
	};

	updateStep = (x, currentStep, xArray) => {
		for (let i = 0; i < xArray.length - 1; i++) {
			if (x >= xArray[i] && x < xArray[i + 1]) {
				return i
			}
		}
		return xArray.length -1
	};

	renderCircle = (currentStep, styles) => {
		const circles = []
		const { points, pointsDisplay } = this.props
		if ( pointsDisplay === true) {
			for(let idx=0; idx<=currentStep; idx++){
				circles.push( <circle key={`circle${idx}`} cx={points[idx].x} cy={points[idx].y} {...styles}/> )
			}
		}
		return circles
	};

	getXArray = () => {
		const { points } = this.props
		return points.map((point, idx)=>(point.x))
	};

	render(){
		const { points, xOffset, yOffset } = this.props

		let lineFunctions = this.genLineFunctions()
		let xArray = this.getXArray()

		let currentStep = 0
		let previousStep = 0
		const x0 = points[0].x
		const y0 = points[0].y
		const lastX = points[points.length - 1].x
		let count = 0
		let path = Path().moveto(x0, y0)
		const { lineStyles, circleStyles }= this.props

		return (
			<g transform={`translate(${xOffset}, ${yOffset})`}>
				<Motion
					defaultStyle={{ x: 0 }}
					style={{ x: spring(100, { stiffness: 100 }) }}>
					{
						value => {
							let x = linearInterpolator(xArray, value.x, 100)  // xarray, current-value, stiffness <= third arg is stiffness, currently only 'default' and 100 is available
							currentStep = this.updateStep(x, currentStep, xArray)
							for (let i = previousStep+1; i <=currentStep; i++) {
								path = path.lineto(points[i].x, points[i].y)
							}
							previousStep = currentStep
							let getY = lineFunctions[currentStep]
							let y = getY(x)
							if (x <= xArray[xArray.length - 1]) {
								path = path.lineto(x, y)
							}

							return (
								<g>
								<path d={path.print()} {...lineStyles} ></path>
									{this.renderCircle(currentStep, { ...circleStyles })}
								</g>
							)
						}
					}
				</Motion>
			</g>
		)
	}
}

