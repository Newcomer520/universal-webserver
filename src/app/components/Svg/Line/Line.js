import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import Path from 'paths-js/path'

export default class Line extends Component {
	render(){
		const { points, pointsDisplay, marginLeft, marginButtom, circleRadius } = this.props
		const LineFunctions = points.map((point, idx)=>{
			let  x1, y1, x2, y2
			x1 = points[idx].x
			y1 = points[idx].y
			if(idx + 1 === points.length){
				x2 = points[idx].x
				y2 = points[idx].y
			}else{
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

		const xArray = points.map((point, idx)=>(point.x))
		let currentStep = 0
		const updateStep = (x, currentStep, xArray) => {
			// reach the lastest step
			if(currentStep + 1 === xArray.length) {
				return currentStep
			}
			// not finish current step
			if( x < xArray[currentStep + 1] ) return currentStep

			// rest condition
			return currentStep + 1
		}

		const x1 = points[0].x
		const y1 = points[0].y
		const lastX = points[points.length - 1].x
		let path = Path().moveto(x1, y1)

		const renderCircle = (currentStep, styles) => {
			const circles = []
			if( pointsDisplay === true){
				for(let idx=0; idx<=currentStep; idx++){
					circles.push( <circle key={`circle${idx}`} cx={points[idx].x} cy={points[idx].y} {...styles}/> )
				}
			}
			return circles
		}

		return (
			<g>
			<Motion
				defaultStyle={{ x: x1 }}
				style={{
					x: spring(lastX, { stiffness: 27, damping: 90 })
			}}>
				{
					value => {
						currentStep = updateStep(value.x, currentStep, xArray)
						let getY = LineFunctions[currentStep]
						let y = getY(value.x)
						path = path.lineto(value.x, y)

						return (
							<g style={{border: '1px solid #cf0'}}>
							<path strokeDasharray="false" d={path.print()} fill={'none'} stroke={'#50b4aa'} strokeWidth={2} ></path>
							{ renderCircle(currentStep, { display: pointsDisplay, r: circleRadius, strokeWidth:2, stroke:'#50b4aa', fill:'#fff' }) }
							</g>
						)
					}
				}
			</Motion>
			</g>
		)
	}
}

