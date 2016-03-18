import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import d3 from 'd3'
import Path from 'paths-js/path'

export default class MotionLine extends Component{
	constructor(props){
		super(props)
			this.state = {
			}
	}
	render(){
		var points = [
			{ "x": 1,   "y": 100},
			{ "x": 20,  "y": 221},
			{ "x": 50,  "y": 12},
			{ "x": 60,  "y": 142},
			{ "x": 80,  "y": 10},
			{ "x": 100, "y": 246},
			{ "x": 150, "y": 24},
			{ "x": 200, "y": 246},
			{ "x": 250, "y": 24},
			{ "x": 300, "y": 246}
		]

		var LineFunctions = points.map((point, idx)=>{
			let  x1, y1, x2, y2
			x1 = points[idx].x
			y1 = points[idx].y
			if( idx+1 === points.length ){
				x2 = points[idx].x
				y2 = points[idx].y
			}else{
				x2 = points[idx+1].x
				y2 = points[idx+1].y
			}

			return (
				(x) => {
					let m = 1
					if(x2 - x1 === 0) m = 0
					else m = (y2-y1) / (x2 - x1)
					return m * ( x - x1 ) + y1
				}
			)
		})

		var xArray = points.map((point, idx)=>(point.x))
		var currentStep = 0
		var updateStep = (x, currentStep, xArray) => {
			// reach the lastest step
			if( currentStep + 1 === xArray.length  ) {
				return currentStep
			}
			// not finish current step
			if( x < xArray[currentStep+1] ) return currentStep

			// rest condition
			return currentStep+1
		}

		var x1 = points[0].x
		var y1 = points[0].y
		var lastX = points[points.length-1].x
		var path = Path().moveto(x1,y1)

    return (
			<Motion
				defaultStyle={{x: x1}}
				style={{
					x: spring(lastX,{stiffness:30, damping:90})
			}}>
				{
					value => {
						currentStep = updateStep(value.x, currentStep, xArray)
						let getY = LineFunctions[currentStep]
						path = path.lineto( value.x, getY(value.x) )
						return <path d={path.print()} fill={'none'} strokeWidth={4} stroke={'blue'}></path>
					}
				}
			</Motion>
    )
	}
}

