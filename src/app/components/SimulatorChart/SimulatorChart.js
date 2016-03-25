import React, { Component, PropTypes } from 'react'
import Line from 'components/Svg/Line'
import PredictLine from 'components/Svg/PredictLine'
import XTimeAxis from 'components/Svg/XTimeAxis'
import YTimeAxis from 'components/Svg/YTimeAxis'
import YGridLine from 'components/Svg/YGridLine'
import moment from 'moment'
import d3 from 'd3'

import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class SimulatorChart extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render(){
		const margin = {top: 20, right: 10, bottom: 30, left: 10};
		const upperBound = 140, lowerBound = 110
		const circleRadius = 6
		const { width, height, points, pointsDisplay, predictFitPoints, predictUprPoints, predictLwrPoints, simFitPoints, simUprPoints, simLwrPoints } = this.props
		const AxisOffsetX = 20
		const AxisOffsetY = 0
		const yMaxOffset = 20
		// the radius of points will make the scale ratio different, cut it
		const widthMargin = margin.left + margin.right + circleRadius
		const heightMargin = margin.top + margin.bottom + circleRadius
		const widthOffset = width - widthMargin - AxisOffsetX
		const heightOffset = height - heightMargin + AxisOffsetY

		// real line
		const xArray = points.map((point, idx)=>(point.x))
		const yArray = points.map((point, idx)=>(point.y))

		// predict line
		const predictXArray = predictFitPoints.map((point, idx)=>(point.x))
		const predictFitYArray = predictFitPoints.map((point, idx)=>(point.y))
		const predictUprYArray = predictUprPoints.map((point, idx)=>(point.y))
		const predictLwrYArray = predictLwrPoints.map((point, idx)=>(point.y))

		// sim line
		const simXArray = simFitPoints.map((point, idx)=>(point.x))
		const simFitYArray = simFitPoints.map((point, idx)=>(point.y))
		const simUprYArray = simUprPoints.map((point, idx)=>(point.y))
		const simLwrYArray = simLwrPoints.map((point, idx)=>(point.y))

		// the rightst axis, need half column margin
		// x axis is timing scale, 30 min per column
		// half : 15min * 60sec/min * 1000 msec/sec
		const rightestOffset = 30 * 60 * 1000 / 2

		const xMax = Math.max(...xArray, ...predictXArray) + rightestOffset
		const xMin = Math.min(...xArray, ...predictXArray)

		const yMax = Math.max(...yArray, ...predictUprYArray, ...simUprYArray) + yMaxOffset
		const yMin = Math.min(...yArray, ...predictLwrYArray, ...simLwrYArray) - yMaxOffset

		// because the margin will infurence the scale ratio, we pick the larger one as the scale ratio
		// const scaleRatio = (widthMargin > heightMargin) ?
		// 			(widthOffset / width) : (heightOffset / height)
		const scaleRatioX = 	(widthOffset / width)
		const scaleRatioY = 	(heightOffset / height)

		const xRange = d3.time.scale().range([0, widthOffset])
		const yRange = d3.scale.linear().range([0, heightOffset])

		const pointsXScale = xRange.domain([xMin, xMax])
		const pointsYScale = yRange.domain([yMax, yMin])

		const pointsScale = points.map((point, idx)=>(
			{ x: pointsXScale(point.x), y: pointsYScale(point.y) }
		))

		const predictFitPointsScale = predictFitPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

		const predictUprPointsScale = predictUprPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

		const predictLwrPointsScale = predictLwrPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

		const simFitPointsScale = simFitPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

		const simUprPointsScale = simUprPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))

		const simLwrPointsScale = simLwrPoints.map((predictPoint, idx)=>(
			{ x: pointsXScale(predictPoint.x), y: pointsYScale(predictPoint.y) }
		))


		const xStartTime = moment("2016-10-20 8:30", "YYYY-MM-DD HH:mm")

		const greenLineStyles = {
			circleStyles: { r: circleRadius, strokeWidth: 2, stroke: '#50b4aa', fill: '#fff'},
			lineStyles: { strokeWidth: 2, fill: 'none', stroke: '#50b4aa', strokeDasharray:"none"  }
		}

		const redLineStyles = {
			circleStyles: { r: 0, strokeWidth: 2, stroke: '#e61673', fill: '#fff'},
			lineStyles: { strokeWidth: 2, fill: 'none', stroke: '#e61673', strokeDasharray:"none"  },
			fillStyles: { stroke: '#e61673', opacity: 0.1 }
		}

		const blueLineStyles = {
			circleStyles: { r: 0, strokeWidth: 2, stroke: '#00a0e9', fill: '#fff'},
			lineStyles: { strokeWidth: 2, fill: 'none', stroke: '#00a0e9', strokeDasharray:"none"  },
			fillStyles: { stroke: '#00a0e9', opacity: 0.5 }
		}

		const clickCallback = (d,i) => {alert(d,i)}

		return (
				<svg width={widthOffset} height={heightOffset}>
					<g transform={`translate(${margin.left + circleRadius}, ${margin.top + circleRadius})
													scale(${scaleRatioX}, ${scaleRatioY})`}>

						<XTimeAxis xScale={pointsXScale} x={AxisOffsetX} y={heightOffset} callback={clickCallback} height={height} heightOffset={heightMargin}/>
						<YTimeAxis yScale={pointsYScale} x={AxisOffsetX} y={AxisOffsetY} upperBound={upperBound} lowerBound={lowerBound}/>

						<PredictLine fitPoints={predictFitPointsScale} uprPoints={predictUprPointsScale} lwrPoints={predictLwrPointsScale} pointsDisplay={'false'} xOffset={AxisOffsetX} yOffset={AxisOffsetY} {...redLineStyles} />
						<PredictLine fitPoints={simFitPointsScale} uprPoints={simUprPointsScale} lwrPoints={simLwrPointsScale} pointsDisplay={'false'} xOffset={AxisOffsetX} yOffset={AxisOffsetY} {...blueLineStyles} />
						<Line points={pointsScale} pointsDisplay={pointsDisplay} xOffset={AxisOffsetX} yOffset={AxisOffsetY} {...greenLineStyles} />

						<YGridLine xScale={pointsXScale} yScale={pointsYScale} xOffset={AxisOffsetX} yOffset={AxisOffsetY} w={width} upperBound={upperBound} lowerBound={lowerBound} />
					</g>
				</svg>
		)
	}
}

//
