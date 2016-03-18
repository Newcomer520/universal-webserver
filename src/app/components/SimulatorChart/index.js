import React, { Component, PropTypes } from 'react'
import Line from 'components/Svg/Line'
export default class SimulatorChart extends Component{
	constructor(props){
		super(props)
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

    return (
    	<div>
    		<svg width={400} height={500}>
    			<Line />
					<circle cx={points[0].x} cy={points[0].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[1].x} cy={points[1].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[2].x} cy={points[2].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[3].x} cy={points[3].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[4].x} cy={points[4].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[5].x} cy={points[5].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[6].x} cy={points[6].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[7].x} cy={points[7].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[8].x} cy={points[8].y} r={10} stroke="black" fill="red"/>
					<circle cx={points[9].x} cy={points[9].y} r={10} stroke="black" fill="red"/>
    		</svg>
    	</div>
    )
	}
}
