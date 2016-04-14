import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import DatePicker from 'components/DatePicker'
import styles from './user-bar.css'

@CSSModules(styles)
export default class UserBar extends Component {
	render() {
		return (
			<div styleName="user-bar">
				<div styleName="user-info-container">
					<div styleName="user-info">
						<div>
							姓名：方大同  年齡：40  病歷號碼：A1256890  透析床號：B02  其他相關系統性疾病：糖尿病、高血壓常態症狀高血壓常態症狀高血壓常態症狀
						</div>
					</div>
				</div>
				<DatePicker/>
			</div>
		)
	}
}
