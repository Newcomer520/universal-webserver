import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { StaggeredMotion, spring } from 'react-motion'
import Path from 'paths-js/path'

export default class PredictLine extends Component {
	render(){
		// prevInterpolatedStyles[i - 1].h , previous' interpolate value
		// prevInterpolatedStyles[i].h current interpolative value
		// prevInterpolatedStyles 上一次render的即時新值們
		// style是 一個array，準備套用在child中的element array
		// 當i =0時， 就是spring到 原生array的  i+1
		// 當i !=0時，要先看 前一個的x 跑到跟 原生array的下一個一樣沒
		// 若一樣了，才 spring往自己的下一個

		// child這邊是要一次render數 段line
		// 每一段的line一開始長度都是0
		// 只有第一段先spring長完
		// 長完後才換第二個長
		const config ={ stiffness:180, damping: 40}
		const { points } = this.props
		return (
			<g>
			<StaggeredMotion
				defaultStyles={points}
				styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
					if(i === 0){
						return { x: spring(points[1].x, config), y: spring(points[1].y, config)}
					}
					else{
						// previous inter value equal to it's end point
						if( i < points.length-1){
							if(prevInterpolatedStyles[i-1].x === points[i].x){
								return { x: spring(points[i+1].x, config), y: spring(points[i+1].y, config) }
							}else{
								return { x: points[i].x, y: points[i].y}
							}
						}else{
							return { x: points[i].x, y: points[i].y}
						}
					}
				})}>
				{interpolatingStyles =>{
					return (
						<g>
							{
								interpolatingStyles.map((style, i) => {
									return  (
										<line key={`line${i}`} x1={points[i].x} y1={points[i].y} x2={style.x} y2={style.y} style={{stroke: '#e61673', strokeWidth:2}}/>
									)
								})
							}
						</g>)
				}}
			</StaggeredMotion>
			</g>
		)
	}
}
