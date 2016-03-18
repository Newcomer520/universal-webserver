import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import d3 from 'd3'
import Path from 'paths-js/path'



class MotionLine extends Component{
	constructor(props){
		super(props)
			this.state = {
			}
	}
	render(){
		var points = [
			{ "x": 1,   "y": 21},
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
  	var path = Path().moveto(1,5)

    return (
			<Motion defaultStyle={{x: 1}}
			style={{
				x: spring(300)
			}}>
				{
					value => {

						var x = value.x
						// console.log(x)
						var x1, y1, x2, y2, y, getY
						points.map((point, idx)=>{
							// 0, 1, 1
							// 1, 1, 20
							// 2, 1, 50
							console.log(idx,x,point.x)
							// watch your x, if x < point.x wont enter loop and cause error
							if( x >= point.x  && idx < points.length-1 ){

								x1 = point.x
								y1 = point.y
								x2 = points[idx+1].x
								y2 = points[idx+1].y
								// console.log(idx,x1, x2 , y1, y2)
								getY = d3.scale.linear().range([ y1, y2 ]).domain([x1,x2])
							}
						})
						y = getY(x)
						path = path.lineto(x,y)

						return <path d={path.print()} fill={'none'} strokeWidth={4} stroke={'blue'}></path>
					}
				}
			</Motion>
    )
	}
}
export default class Svg extends Component{
	constructor(props){
		super(props)
			this.state = {
			}
	}
	render(){
    return (
    	<div>
    		<svg width={400} height={500}>
    			<MotionLine />
    		</svg>
    	</div>
    )
	}
}
