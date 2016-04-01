import React, { Component, PropTypes } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import styles from './styles.css'

export default class XTimeAxis extends Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    xScaleFunc: PropTypes.func,
    callback: PropTypes.func,
    height: PropTypes.number,
    heightOffset: PropTypes.number,
    currentTime: PropTypes.number,
    currentX: PropTypes.number
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { x, y, xScaleFunc, callback, height, heightOffset, currentTime, currentX } = this.props

    const xAxis = d3.svg.axis()
    .scale(xScaleFunc)
    .orient("bottom")
    .tickFormat(d3.time.format("%H:%M"))
    .tickSize(-height + heightOffset, 0)
    .tickPadding(12)
    const vdom = ReactFauxDOM.createElement('g')
    const g = d3.select(vdom)
    .attr('className', 'xAxis')
    .attr("transform", `translate(${x}, ${y})`)
    .call(xAxis)
    .selectAll(".tick")
    .on("click", (d, i) => {
      callback(d, i)
    })
    d3.select(vdom).selectAll('.tick')
    .filter((d) => (d.valueOf() === currentTime))
    .attr('className', styles.currentTime)

    // dynamic vertical dash line
    if (currentX > 0) {
      d3.select(vdom).append('line')
      .attr('className', styles.currentLine)
        .attr('x1', currentX)
        .attr('x2', currentX)
        .attr('y1', 0)
        .attr('y2', -height + heightOffset)
    }


    return <g className={styles.xAxis} >{vdom.toReact()}</g>
  }
}
