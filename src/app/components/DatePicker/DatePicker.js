import React, { Component, PropTypes } from 'react'
import styles from './style.css'


export default class DatePicker extends Component {
	static propTypes = {
		// dates: PropTypes.array.isRequired <div className={styles['date-picker']}>
	};

	render() {
		return (
			<div className={styles['date-picker']}>
				<i className="caret left icon big"></i>
				<div className={styles['date-picker__current-pick']}>
					2015-08-10
				</div>
				<i className="caret right icon big"></i>
			</div>
		)
	}
}
