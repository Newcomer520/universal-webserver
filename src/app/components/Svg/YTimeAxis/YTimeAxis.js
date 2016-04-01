import React, { Component, PropTypes } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import styles from './styles.css'

export default class YTimeAxis extends Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    yScale: PropTypes.func,
    upperBound: PropTypes.number,
    lowerBound: PropTypes.number,
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { x, y, yScale, upperBound, lowerBound } = this.props

    const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(0, 0)
    .tickPadding(10)
    .tickValues([upperBound, lowerBound])

    const vdom = ReactFauxDOM.createElement('g')
    const g = d3.select(vdom)
    .attr("transform", `translate(${x}, ${y})`)
    .call(yAxis)

    return <g className={styles.yAxis}>{vdom.toReact()}</g>
  }
}
