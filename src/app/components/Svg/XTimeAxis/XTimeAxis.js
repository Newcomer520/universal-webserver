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
    currentTime: PropTypes.number
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { xScaleFunc, callback, width, height, currentTime } = this.props

    const xAxis = d3.svg.axis()
    .scale(xScaleFunc)
    .orient("bottom")
    .tickFormat(d3.time.format("%H:%M"))
    .tickSize(-height, 0)
    .tickPadding(17)
    const vdom = ReactFauxDOM.createElement('g')
    const g = d3.select(vdom)
    .attr('className', 'xAxis')
    // .attr("transform", `translate(${x}, ${y})`)
    // .attr("viewBox", `${0} ${0} ${800-100} ${400}`)
    .call(xAxis)
    .selectAll(".tick")
    .on("click", (d, i) => {
      callback(d, i)
    })
    d3.select(vdom).selectAll('.tick')
    .filter((d) => (d.valueOf() === currentTime))
    .attr('className', styles.currentTime)

    return <g className={styles.xAxis} >{vdom.toReact()}</g>
  }
}
