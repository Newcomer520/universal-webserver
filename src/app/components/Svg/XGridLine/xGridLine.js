import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class XGridLine extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		// const { h, w, xOffset, yOffset, xScale, yScale, xArray, max, min } = this.props

		// const xStartPt = xScale(xArray[0])
		// const xEndPt = xScale(xArray[xArray.length - 1])
		// const X_COLUMN_COUNT = 9
		// const X_COLUMN_WIDTH = (xEndPt - xStartPt) / X_COLUMN_COUNT
		// const yMin = yScale(min)
		// const yMax = yScale(max)

		// const linePts = []

		// for(let i=0; i<=X_COLUMN_COUNT; i++){
		// 	linePts.push([
		// 		{x: xStartPt + (X_COLUMN_WIDTH * i) + xOffset, y: yMin},
		// 		{x: xStartPt + (X_COLUMN_WIDTH * i) + xOffset, y: yMax + yOffset}
		// 	])
		// }
    const vdom = ReactFauxDOM.createElement('g')
		const  { pointsUp, pointsBottom, xOffset } = this.props


		for(let i =0; i<299; i++){
			let x1,x2,y1,y2
			x1 = pointsBottom[i].x + xOffset
			y1 = pointsBottom[i].y
			x2 = pointsBottom[i].x + xOffset
			y2 = pointsUp[i].y

			d3.select(vdom)
			.append('line')
			.attr('x1', x1)
			.attr('y1', y1)
			.attr('x2', x2)
			.attr('y2', y2)
			.attr("opacity", 0.1)
			.attr("stroke-width", 2.4)
			.attr("stroke", "#e61673")
		}



    // linePts.forEach((line,i)=>{
    	// if(i>0){

			// }
    // })

		return vdom.toReact()
	}
}

