import React, { Component, PropTypes } from 'react'
import Line from 'components/Svg/Line'
import PredictLine from 'components/Svg/PredictLine'
import d3 from 'd3'

export default class SimulatorChart extends Component {
	render(){
		const margin = {top: 20, right: 10, bottom: 20, left: 10};
		const circleRadius = 6
		const { width, height, points, pointsDisplay, predictPoints } = this.props

		// the radius of points will make the scale ratio different, cut it
		const widthMargin = margin.left + margin.right + circleRadius
		const heightMargin = margin.top + margin.bottom + circleRadius
		const widthOffset = width - widthMargin
		const heightOffset = height - heightMargin

		const xArray = points.map((point, idx)=>(point.x))
		const yArray = points.map((point, idx)=>(point.y))

		const xMax = Math.max(...xArray)
		const yMax = Math.max(...yArray)

		// because the margin will infurence the scale ratio, we pick the larger one as the scale ratio
		const scaleRatio = (widthMargin > heightMargin) ?
					(widthOffset / width) : (heightOffset / height)



		const xRange = d3.scale.linear().range([0, widthOffset])
		const yRange = d3.scale.linear().range([heightOffset, 0])

		const pointsXScale = xRange.domain([0, xMax])
		const pointsYScale = yRange.domain([yMax, 0])

		const pointsScale = points.map((point, idx)=>(
			{ x: pointsXScale(point.x), y: pointsYScale(point.y) }
		))

		const predictPointsScale = predictPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

    return (
    	<div>
    		<svg style={styles.container} width={widthOffset} height={heightOffset}>
    			<g transform={`translate(${margin.left + circleRadius}, ${margin.top + circleRadius})
    											scale(${scaleRatio})`}>
    				<Line points={pointsScale} pointsDisplay={pointsDisplay} circleRadius={circleRadius}/>
    				<PredictLine points={predictPointsScale} />
    			</g>
    		</svg>
    	</div>
    )
	}
}

const styles = {
	container: {
		border: '1px solid #555'
	}
}
