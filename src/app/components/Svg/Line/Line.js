import React, { Component, PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import Path from 'paths-js/path'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { linearInterpolator } from '../hack-spring100-to-linear'
import transitionStyle from './transition.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
export default class Line extends Component {

  static propTypes = {
    lineStyles: PropTypes.object,
    circleStyles: PropTypes.object,
    points: PropTypes.array, // after scale ( x and y values)
    pointsDisplay: PropTypes.bool,
    values: PropTypes.array, // before scale (y values)
    callback: PropTypes.func,
    times: PropTypes.array,
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  /**
   * Get time axis
   * @param {array} points - an array contain points positions like [{x1, y1}, {x2, y2}...]
   * these points must has been scaled by d3.time.scale()
   */
  getXArray = () => {
    const { points } = this.props
    return points.map((point) => (point.x))
  };

  /**
   * Get time axis
   * @param {array} points - an array contain points positions like [{x1, y1}, {x2, y2}...]
   * these points must has been scaled by d3.time.scale()
   */
  genLineFunctions = () => {
    const { points } = this.props
    const lines = points.map((point, idx) => {
      const x1 = points[idx].x
      const y1 = points[idx].y
      let x2 = 0
      let y2 = 0
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
          if (x2 - x1 === 0) {
            m = 0
          } else {
            m = (y2 - y1) / (x2 - x1)
          }
          return (m * (x - x1) + y1)
        }
      )
    })
    return lines
  };

  updateStep = (x, xArray) => {
    for (let i = 0; i < xArray.length - 1; i++) {
      if (x >= xArray[i] && x < xArray[i + 1]) {
        return i
      }
    }
    return xArray.length - 1
  };

  renderCircle = (currentStep, styles) => {
    const circles = []
    const { points, values } = this.props
    const { callback, times } = this.props
    if (values) {
      for (let idx = 0; idx <= currentStep; idx++) {
        circles.push(
          <g key={`circle-${idx}`}>
            <ReactCSSTransitionGroup
              component="g"
              transitionAppear={true}
              transitionName={transitionStyle}
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              <Tooltip
                cx={points[idx].x} cy={points[idx].y} idx={idx}
                callback={callback} times={times}
                styles={{ ...styles }} value={parseInt(values[idx], 10)} />
            </ReactCSSTransitionGroup>

          </g>)
      }
    }
    return circles
  };

  render() {
    const { points } = this.props

    const lineFunctions = this.genLineFunctions()
    const xArray = this.getXArray()

    let currentStep = 0
    let previousStep = 0
    const x0 = points[0].x
    const y0 = points[0].y


    let path = Path().moveto(x0, y0)
    const { lineStyles, circleStyles } = this.props

    return (
      <g  >
        <Motion
          defaultStyle={{ x: 0 }}
          style={{ x: spring(100, { stiffness: 100 }) }} >
          {
            value => {
              const x = linearInterpolator(xArray, value.x, 100)
              // xarray, current-value, stiffness <= third arg is stiffness,
              // currently only 'default' and 100 is available
              currentStep = this.updateStep(x, xArray)
              for (let i = previousStep + 1; i <= currentStep; i++) {
                path = path.lineto(points[i].x, points[i].y)
              }
              previousStep = currentStep
              const getY = lineFunctions[currentStep]
              const y = getY(x)
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

class Tooltip extends Component {

  static propTypes = {
    styles: PropTypes.object,
    cx: PropTypes.number,
    cy: PropTypes.number,
    value: PropTypes.number,
    idx: PropTypes.number,
    callback: PropTypes.func,
    times: PropTypes.array,
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  state = {
    r: this.props.styles.r,
    fontSize: 14
  };

  enter = () => {
    this.setState({
      r: 10,
      fontSize: 18
    })
  };

  leave = () => {
    this.setState({
      r: this.props.styles.r,
      fontSize: 14,
    })
  };

  click = () => {
    const { idx, callback, times } = this.props
    callback(new Date(times[idx].x), idx)
  };

  render() {
    const { cx, cy, value, styles, idx } = this.props
    const { fontSize } = this.state

    // Prevent text label overlap
    const textX = cx - fontSize
    const textY = (idx % 2 === 0) ? (cy + 2 * fontSize) : (cy - fontSize)

    return (
      <g>
        <text
          x={textX} y={textY}
          fontSize={fontSize} >{value}</text>
        <circle
          cx={cx} cy={cy}
          onClick={this.click}
          onMouseEnter={this.enter}
          onMouseLeave={this.leave}
          {...styles}
          r={this.state.r} />
      </g>
    )
  }
}
