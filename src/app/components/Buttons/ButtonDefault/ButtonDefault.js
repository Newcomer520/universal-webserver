import React, { Component } from 'react'
import styles from 'app/css/components.css'
import cx from 'classnames'

export default class ButtonDefault extends Component {
	render() {
		// return <button>{this.props.children}</button>
		const { style, className, children, ...restProps } = this.props

		return (
			<button
				style={style}
				className={cx("ui button circular-rect", className)}
				{...restProps}>
				{this.props.children}
			</button>
		)
	}
}

// export default (props) => {
// 	return (
// 		<button
// 			className="circular-rect">
// 			{props.children}
// 		</button>
// 	)
// }
