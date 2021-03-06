import React, { Component, PropTypes } from 'react'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default class YGridLine extends Component {

  static propTypes = {
    w: PropTypes.number,
    yScaleFunc: PropTypes.func,
    upperBound: PropTypes.number,
    lowerBound: PropTypes.number,
  };

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { w, yScaleFunc, upperBound, lowerBound } = this.props

    const smax = yScaleFunc(upperBound)
    const smin = yScaleFunc(lowerBound)
    const maxLinePts = [{ x: 0, y: smax }, { x: w, y: smax }]
    const minLinePts = [{ x: 0, y: smin }, { x: w, y: smin }]

    const vdom = ReactFauxDOM.createElement('g')

    d3.select(vdom)
    .append('line')
    .attr('x1', maxLinePts[0].x)
    .attr('y1', maxLinePts[0].y)
    .attr('x2', maxLinePts[1].x)
    .attr('y2', maxLinePts[1].y)
    .attr("stroke-dasharray", "3, 3")
    .attr("stroke-width", 2)
    .attr("opacity", 0.5)
    .attr("stroke", "black")

    d3.select(vdom)
    .append('line')
    .attr('x1', minLinePts[0].x)
    .attr('y1', minLinePts[0].y)
    .attr('x2', minLinePts[1].x)
    .attr('y2', minLinePts[1].y)
    .attr("stroke-dasharray", "3, 3")
    .attr("stroke-width", 2)
    .attr("opacity", 0.5)
    .attr("stroke", "black")

    return vdom.toReact()
  }
}
