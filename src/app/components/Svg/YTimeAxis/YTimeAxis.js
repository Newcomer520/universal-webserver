import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import styles from './styles.css'

export default class YTimeAxis extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render(){
		const { x, y, yScale, upperBound, lowerBound } = this.props

		const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(0,0)
    .tickPadding(10)
    .tickFormat(
    	(d)=>{
    		if(d===upperBound || d===lowerBound){
					return d
				} else {
					return
				}
  	})

    const vdom = ReactFauxDOM.createElement('g')
		const g = d3.select(vdom)
		.attr("transform", `translate(${x} , ${y})`)
		.call(yAxis)

		// vdom.setAttribute("style", this.props.style)
		console.log(styles)
		return <g className={styles.yAxis} >{vdom.toReact()}</g>
	}
}

