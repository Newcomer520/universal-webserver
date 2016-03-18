import React, { Component } from 'react'
import Radium from 'radium'
import Line from 'components/Svg/Line/Line'
@Radium
export default class Demo27 extends Component {
	render() {
		return (
			<div style={styles.container}>
				<div style={styles.main}>
					<div style={[styles.left, styles.paddingTop10]}>
						<Line />
					</div>
					<div style={[styles.right, styles.paddingTop10]}>
						manipulation
					</div>
				</div>
			</div>
		)
	}
}

const styles = {
	container: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	main: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center'
	},
	paddingTop10: {
		paddingTop: '10px'
	},
	left: {
		flex: '1',
		minWidth: '400px',
		height: '500px',
		background: 'radial-gradient( ellipse farthest-corner , #0FD2FA 0%, #20438E 100%)'
	},
	right: {
		width: '400px',
		backgroundColor: 'lightyellow'
	}
}
