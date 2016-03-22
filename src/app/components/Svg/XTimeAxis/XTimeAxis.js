import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import styles from './styles.css'

export default class XTimeAxis extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { x, y, xScale, callback, height, heightOffset } = this.props

		const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%H:%M"))
		.tickSize(-height+heightOffset,0)
		.tickPadding(12)
    const vdom = ReactFauxDOM.createElement('g')
		const g = d3.select(vdom)
		.attr('className', 'xAxis')
		.attr("transform", `translate(${x}, ${y})`)
		.call(xAxis)
		.selectAll(".tick")
		.on("click", function(d,i) {
			callback(d,i)
		})
		return <g className={styles.xAxis} >{vdom.toReact()}</g>
	}
}

