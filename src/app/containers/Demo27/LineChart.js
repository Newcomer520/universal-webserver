import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import d3 from 'd3'
import moment from 'moment'
import ReactFauxDOM from 'react-faux-dom'
export default class LineChart extends Component{
	constructor(props){
		super(props)
			this.state = {
				currentFactor: 1,
				previousFactor:1,
				lineData : [
					{ "x": 1,   "y": 5},
					{ "x": 20,  "y": 21},
					{ "x": 50,  "y": 25},
					{ "x": 60,  "y": 42},
					{ "x": 80,  "y": 5},
					{ "x": 100, "y": 60}
				]
			}
	}
	da = () => {
		var newFactor = this.state.currentFactor *1.5

		this.setState({
			currentFactor: newFactor,
			previousFactor: this.state.currentFactor
		})
	}
	xiao = () => {
		var newFactor = this.state.currentFactor /1.5

		this.setState({
			currentFactor: newFactor,
			previousFactor: this.state.currentFactor
		})
	}

	render(){

		var startTime = moment().startOf('day')
		var endTime = moment().endOf('day')
		var currentTime = moment().hour(0).minute(0).second(0)
		var timeArray = []

		while( currentTime.isBefore(endTime)){
			timeArray.push(currentTime.add(30,'m').format('HH:mm'))
		}
		console.log(timeArray)

		return (
			<div >
			{endTime.format('HH:mm')}
			<button onClick={this.da}>大</button>
			<button onClick={this.xiao}>小</button>
				<Motion
					defaultStyle={{x:this.state.previousFactor}}
					style={
						{
							x: spring(
								this.state.currentFactor,
								{stiffness:60, damping:15, precision: 0.01}
							)
						}
				}>
					{
						interpolatedStyle =>  {
							return  (
								<Comt lineData={this.state.lineData} factor={interpolatedStyle.x}/>
							)
						}
					}
				</Motion>
			</div>
		)

	}
}
class xAxiss extends Component{
	constructor(props){
		super(props)
				this.state = {

				}
	}
	render(){
		var xscale = d3.time.scale()
    .domain([new Date, new Date])
    .nice(d3.time.day)
    .range([0, this.state.width])

		var xAxis = d3.svg
			.axis()
			.scale(xscale)
			.orient("bottom")
		const vxAxis = d3.select(ReactFauxDOM.createElement('g'))
		.attr('transform', 	'translate('+ this.props.left+','+ this.props.top-30+' )' )

		.call(xAxis);
		return vxAxis.node().toReact()
	}
}
class Comt extends Component{
	constructor(props){
		super(props)
				this.state = {
					width: 600,
					height: 300,
					top:0,
					left:0
				}
	}
	componentWillReceiveProps(){
		var newFactor = this.props.factor
		var newTop = (1-newFactor)*(this.state.height/2)
		var newLeft = (1-newFactor)*(this.state.width/2)
		this.setState({
			left:newLeft,
			top:newTop
		})
	}
	componentWillMount(){
		this.setState({
			xScale: d3.scale.linear().range([0,this.state.width])
				.domain( d3.extent(this.props.lineData, (d)=>(d.x) )),
			yScale: d3.scale.linear().range([0,this.state.height])
				.domain( d3.extent(this.props.lineData, (d)=>(d.y) )),
			lineFunction: d3.svg.line()
				.x(function(d) { return this.state.xScale(d.x) }.bind(this))
				.y(function(d) { return this.state.yScale(d.y) }.bind(this))
		})

	}
	componentDidMount(){
		//axis must put after svg render
		// var ha = []
		// ha.push(moment().hour(11).minute(10))
		// ha.push(moment().hour(12).minute(10))
		// ha.push(moment().hour(1).minute(10))


	}
	render(){
		return (<div onClick={this.goclick}>
		<svg
			width={this.state.width}
			height={this.state.height} >
			<g
				transform={
					`
					translate(
					 ${this.state.left}
					 ${this.state.top}
					)
					scale(  ${this.props.factor} )
					`
				}
			>
				<circle cx={this.state.width/2} cy={this.state.height/2}
								 r="5" stroke="black"
								 strokeWidth="3" fill="red" />
				<path
					d={ this.state.lineFunction(this.props.lineData)}
					stroke="blue"
					strokeWidth="2"
					fill="none">
				</path>
			</g>
			<xAxiss width={this.state.width} height={this.state.height} top={this.state.height-30} left={0}/>
		</svg>
		</div>
		)
	}
}
