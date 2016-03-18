import React, { Component, PropTypes } from 'react'
import Line from 'components/Svg/Line'
import PredictLine from 'components/Svg/PredictLine'
import XTimeAxis from 'components/Svg/XTimeAxis'
import YTimeAxis from 'components/Svg/YTimeAxis'
import YGridLine from 'components/Svg/YGridLine'
import moment from 'moment'
import d3 from 'd3'
import { merge } from 'lodash'

import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class SimulatorChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    actualPoints: PropTypes.array,
    predictPoints: PropTypes.object,
    simulatePoints: PropTypes.object
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  genScalePoints = (actualDataSet, predictDataSet, simulateDataSet, xScaleFunc, yScaleFunc) => {
    const rawPoints = {
      actual: actualDataSet,
      predict: { fit: [], upr: [], lwr: [] },
      simulate: { fit: [], upr: [], lwr: [] }
    }
    const scalePoints = {
      actual: [],
      predict: { fit: [], upr: [], lwr: [] },
      simulate: { fit: [], upr: [], lwr: [] }
    }

    //-------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------
    // generate predict and simulate points arrays
    const genRawPoints = (dataset, pointType) => {
      const time = moment(dataset.startTime, 'x').add(-1, 'm')
      return dataset.rows.map((point) => (
        { x: time.add(1, 'm').valueOf(), y: point[pointType] }
      ))
    }
    // trans points from Raw => Scaled
    const getScalePoints = (originalPoints) => (
      originalPoints.map((ponts) => (
          { x: xScaleFunc(ponts.x), y: yScaleFunc(ponts.y) }
        )
      )
    )

    //-------------------------------------------------------------------------
    // Generate Raw arrays, then convert to Scaled arrays
    // if dataset not fulfill, return empty array
    //-------------------------------------------------------------------------
    scalePoints.actual = getScalePoints(rawPoints.actual)

    for (const key in predictDataSet.rows[0]) {
      if (key in simulateDataSet.rows[0]) {
        // predict raw points
        rawPoints.predict[key] = genRawPoints(predictDataSet, key)
        // predict scaled points
        scalePoints.predict[key] = getScalePoints(rawPoints.predict[key])
        // simulate raw points
        rawPoints.simulate[key] = genRawPoints(simulateDataSet, key)
        // simulate scaled points
        scalePoints.simulate[key] = getScalePoints(rawPoints.simulate[key])
      }
    }
    return scalePoints
  };


  //-------------------------------------------------------------------------
  // Init actual points array
  //-------------------------------------------------------------------------
  // if array from props is
  // 1. NOT null
  // 2. NOT undefined
  // 3. length > 0
  // 4. has a property named 'x'
  // then return the array from props
  // or retuen a hard code array to prevent errors
  // return syntax : [{ x: startTime, y: 0 }, {x:, y:}...]
  //-------------------------------------------------------------------------
  initActualPoints = () => {
    const { actualPoints } = this.props

    const startTime = moment('20160101', 'YYYYDDMM').valueOf()
    let cActualPoints = [{ x: startTime, y: 0 }]

    if (actualPoints && 'length' in actualPoints &&
        actualPoints.length > 0 && 'x' in actualPoints[0]) {
      cActualPoints = actualPoints
    }

    return cActualPoints
  };

  //-------------------------------------------------------------------------
  // Init predict and simulate points array
  //-------------------------------------------------------------------------
  // if arraies from props are
  // 1. NOT null
  // 2. NOT undefined
  // 3. has a property named 'rows'
  // 4. length of array in 'raw' > 0
  // 5. has a property name 'fit' in rows
  // 5. has a property name 'upr' in rows
  // 5. has a property name 'lwr' in rows
  // then return the array from props
  // or retuen a hard code array to prevent errors
  // return syntax : { startTime: , rows: [{ fit:, upr:, lwr:,}, { fit:, upr:, lwr:,}...]}
  //-------------------------------------------------------------------------
  initPredcitSimulatePoints = () => {
    const { predictPoints, simulatePoints } = this.props

    const startTime = moment('20160101', 'YYYYMMDD').valueOf()
    const rows = [{ fit: 0, upr: 0, lwr: 0 }]

    const initPoints = (points) => {
      let cPoints = { startTime, rows }
      if (points && 'startTime' in points &&
        'rows' in points && points.rows.length > 0 &&
        'fit' in points.rows[0] &&
        'upr' in points.rows[0] &&
        'lwr' in points.rows[0]) {
        cPoints = points
      }
      return cPoints
    }

    return { cPredictPoints: initPoints(predictPoints),
             cSimulatePoints: initPoints(simulatePoints) }
  };

  render() {
    //-------------------------------------------------------------------------
    // Blood Presure Constant Values
    //-------------------------------------------------------------------------
    const UPPER_BLOOD_PRESURE_WARNING_BOUND = 140
    const LOWER_BLOOD_PRESURE_WARNING_BOUND = 70
    const MAX_BLOOD_PRESURE_BOUND = 200
    const MIN_BLOOD_PRESURE_BOUND = 0

    //-------------------------------------------------------------------------
    // Props
    //-------------------------------------------------------------------------
    const { width, height } = this.props

    //-------------------------------------------------------------------------
    // Correct dataset
    //-------------------------------------------------------------------------
    // if('startTime' in predictDataSet && 'rows' in predictDataSet &&
    //  ( predictDataSet|| ))
    const cActualPoints = this.initActualPoints()
    const ACTUAL_START_TIME = cActualPoints[0].x
    const { cPredictPoints, cSimulatePoints } = this.initPredcitSimulatePoints()

    //-------------------------------------------------------------------------
    // Layout Configuration and Layout Constants Values
    //-------------------------------------------------------------------------
    const MARGIN = { TOP: 20, RIGHT: 10, BOTTOM: 30, LEFT: 30 }

    const AXIS_OFFSET_X = 20
    const AXIS_OFFSET_Y = 0
    const Y_MAX_OFFSET = 20
    // the radius of points will make the scale ratio different, cut it

    const widthMargin = MARGIN.LEFT + MARGIN.RIGHT
    const heightMargin = MARGIN.TOP + MARGIN.BOTTOM
    const widthOffset = width - widthMargin - AXIS_OFFSET_X
    const heightOffset = height - heightMargin + AXIS_OFFSET_Y

    const PERIOD_300_MINS = 320 * 60 * 1000


    // round the time
    const roundTime = (time) => {
      const t = moment(time, 'x')
      let roundResult = t
      if (t.minute() % 30 < 15) {
        roundResult = t.add(- (t.minute() % 30), 'm')
      } else {
        roundResult = t.add(30 - (t.minute() % 30), 'm')
      }
      return roundResult
    }

    // actually, we don't need to new Date(), d3 time scale accept unix ms as domain
    // new Date(ACTUAL_START_TIME + PERIOD_300_MINS)
    const xMax = roundTime(ACTUAL_START_TIME) + PERIOD_300_MINS
    const xMin = roundTime(ACTUAL_START_TIME)

    const yMax = MAX_BLOOD_PRESURE_BOUND + Y_MAX_OFFSET
    const yMin = MIN_BLOOD_PRESURE_BOUND - Y_MAX_OFFSET

    // for svg scale (transform scale, node value scale)
    const scaleRatioX = (widthOffset / width)
    const scaleRatioY = (heightOffset / height)

    //-------------------------------------------------------------------------
    // for D3
    //-------------------------------------------------------------------------
    const xRange = d3.time.scale().range([0, widthOffset])
    const yRange = d3.scale.linear().range([0, heightOffset])

    // d3 scale function
    const xScaleFunc = xRange.domain([xMin, xMax])
    const yScaleFunc = yRange.domain([yMax, yMin])

    //-------------------------------------------------------------------------
    // Style's (wait to move to css)
    //-------------------------------------------------------------------------
    const defaultStyles = {
      circleStyles: { r: 0, strokeWidth: 2, stroke: '#e61673', fill: '#fff' },
      lineStyles: { strokeWidth: 2, fill: 'none', stroke: '#e61673',
                    strokeDasharray: 'none' },
      fillStyles: { stroke: '#e61673', opacity: 0.1 }
    }

    const greenLineStyles = merge({}, defaultStyles, {
      circleStyles: { r: 6, stroke: '#50b4aa' },
      lineStyles: { stroke: '#50b4aa' }
    })

    const redLineStyles = merge({}, defaultStyles, {
      circleStyles: { stroke: '#e61673' },
      lineStyles: { stroke: '#e61673' },
      fillStyles: { stroke: '#e61673', opacity: 0.1 }
    })

    const blueLineStyles = merge({}, defaultStyles, {
      circleStyles: { stroke: '#00a0e9' },
      lineStyles: { stroke: '#00a0e9' },
      fillStyles: { stroke: '#00a0e9', opacity: 0.5 }
    })

    //-------------------------------------------------------------------------
    // Callback
    //-------------------------------------------------------------------------
    const clickCallback = (d, i) => {alert(d)}

    //-------------------------------------------------------------------------
    // Generate Points
    //-------------------------------------------------------------------------
    const actualBloodPresures = cActualPoints.map((point) => (point.y))
    const scalePoints = this.genScalePoints(cActualPoints, cPredictPoints,
      cSimulatePoints, xScaleFunc, yScaleFunc)

    return (
      <svg width={widthOffset} height={heightOffset}>
        <g transform={`translate(${MARGIN.LEFT}, ${MARGIN.TOP})
          scale(${scaleRatioX}, ${scaleRatioY})`} >
          <XTimeAxis
            xScaleFunc={xScaleFunc} x={AXIS_OFFSET_X} y={heightOffset} times={cActualPoints}
            callback={clickCallback} height={height} heightOffset={heightMargin} />
          <YTimeAxis
            yScale={yScaleFunc} x={AXIS_OFFSET_X} y={AXIS_OFFSET_Y}
            upperBound={UPPER_BLOOD_PRESURE_WARNING_BOUND}
            lowerBound={LOWER_BLOOD_PRESURE_WARNING_BOUND}/>

          <PredictLine key={`predict${new Date().valueOf()}`}
            fitPoints={scalePoints.predict.fit} uprPoints={scalePoints.predict.upr}
            lwrPoints={scalePoints.predict.lwr}
            xOffset={AXIS_OFFSET_X} yOffset={AXIS_OFFSET_Y} {...redLineStyles} />

          <PredictLine key={`simulate${new Date().valueOf()}`}
            fitPoints={scalePoints.simulate.fit} uprPoints={scalePoints.simulate.upr}
            lwrPoints={scalePoints.simulate.lwr}
            xOffset={AXIS_OFFSET_X} yOffset={AXIS_OFFSET_Y} {...blueLineStyles} />

          <YGridLine
            xScaleFunc={xScaleFunc} yScaleFunc={yScaleFunc}
            xOffset={AXIS_OFFSET_X} yOffset={AXIS_OFFSET_Y}
            w={width} upperBound={UPPER_BLOOD_PRESURE_WARNING_BOUND}
            lowerBound={LOWER_BLOOD_PRESURE_WARNING_BOUND} />

          <Line key={`actual${new Date().valueOf()}`}
            points={scalePoints.actual} values={actualBloodPresures}
            xOffset={AXIS_OFFSET_X} yOffset={AXIS_OFFSET_Y} {...greenLineStyles} />

          <Bound95Text
            enable={(scalePoints.predict.fit.length > 1) ? true : false}
            fill={redLineStyles.circleStyles.stroke}
            xUp={scalePoints.predict.fit[0].x + AXIS_OFFSET_X + 3}
            yUp={scalePoints.predict.fit[0].y - 20}
            textUp={'95% UB'}
            xLow={scalePoints.predict.fit[0].x + AXIS_OFFSET_X + 3}
            yLow={scalePoints.predict.fit[0].y + 40}
            textLow={'95% LB'} />
        </g>
      </svg>
    )
  }
}

class Bound95Text extends Component {

  static propTypes = {
    enable: PropTypes.bool,
    fill: PropTypes.string,
    xUp: PropTypes.number,
    yUp: PropTypes.number,
    textUp: PropTypes.string,
    xLow: PropTypes.number,
    yLow: PropTypes.number,
    textLow: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { enable, fill, xUp, yUp, textUp, xLow, yLow, textLow } = this.props
    if (enable === true) {
      return (
      <g>
        <text fill={fill} x={xUp} y={yUp}>{textUp}</text>
        <text fill={fill} x={xLow} y={yLow}>{textLow}</text>
      </g>
      )
    }

    return <g />
  }
}
