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
class VDOM extends Component{
	constructor(props){
		super(props)
				this.state = {

				}
	}
	render(){
   var data =  [
					{ "x": 1,   "y": 5},
					{ "x": 20,  "y": 21},
					{ "x": 50,  "y": 25},
					{ "x": 60,  "y": 42},
					{ "x": 80,  "y": 5},
					{ "x": 100, "y": 60}
				]
    var margin = {top: 20, right: 20, bottom: 30, left: 50}
    var width = 960 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom

    var parseDate = d3.time.format('%d-%b-%y').parse

    var x = d3.time.scale()
    .range([0, width])

    var y = d3.scale.linear()
    .range([height, 0])

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

    var line = d3.svg.line()
    .x(function (d) { return x(d.x) })
    .y(function (d) { return y(d.y) })

    var node = ReactFauxDOM.createElement('svg')
    var svg = d3.select(node)
    .attr('width', this.props.width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    data.forEach(function (d) {
      d.x = d.x
      d.y = +d.y
    })

    x.domain(d3.extent(data, function (d) { return d.x }))
    y.domain(d3.extent(data, function (d) { return d.y }))

    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

    svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price ($)')

    svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)

    return node.toReact()
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
			<VDOM width={800} height={500}/>
		</div>
		)
	}
}
