import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import DatePicker from 'components/DatePicker'
import styles from './user-bar.css'
import moment from 'moment'

@CSSModules(styles)
export default class UserBar extends Component {
  clickTimeCallback = (d, i) => {
    console.log(d, i)
  }

	render() {
    const d = 1461199531501
    const date = [
      d,
      moment(d).add(1, 'd').valueOf(),
      moment(d).add(2, 'd').valueOf(),
      moment(d).add(3, 'd').valueOf(),
      moment(d).add(4, 'd').valueOf(),
      moment(d).add(5, 'd').valueOf(),
      moment(d).add(6, 'd').valueOf(),
    ]
		return (
			<div styleName="user-bar">
				<div styleName="user-info-container">
					<div styleName="user-info">
						<div>
							姓名：方大同  年齡：40  病歷號碼：A1256890  透析床號：B02  其他相關系統性疾病：糖尿病、高血壓常態症狀高血壓常態症狀高血壓常態症狀
						</div>
					</div>
				</div>
				<DatePicker date={date} clickTimeCallback={this.clickTimeCallback}/>
			</div>
		)
	}
}
