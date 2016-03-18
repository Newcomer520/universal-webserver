import React, { Component } from 'react'
import DropDown from 'components/DropDown/DropDown'
import styles from './demo27.css'
import classnames from 'classnames/bind'
import DatePicker from 'components/DatePicker'
import tableStyle from 'app/css/tables.css'
import componentStyle from 'app/css/components.css'

import FormSBP from 'components/Forms/FormSBP'
import SimulatorChart from 'components/SimulatorChart'

const cx = classnames.bind(styles)
const tcx = classnames.bind(tableStyle)
const ccx = classnames.bind(componentStyle)

export default class extends Component {
	renderFilterBar = () => {
		return (
			<div className={cx('filter-bar')}>
				<div style={{ marginRight: '10px' }}>
					<a className="ui olive tag label">類目</a>
					<DropDown
						style={{ width: '80px', minWidth: '120px' }}
						selectedIndex={-1}
						list={['1', '2']}>
						<span>1</span>
						<span>2</span>
					</DropDown>
				</div>
				<div style={{ marginLeft: '10px' }}>
					<a className="ui teal tag label">細項</a>
					<DropDown
						style={{ width: '8em', minWidth: '120px', borderRadius: '10px' }}
						selectedIndex={-1}
						list={['1', '2']}>
						<span>1</span>
						<span>2</span>
					</DropDown>
				</div>
			</div>
		)
	};

	renderChart = () => {
		return (
			<div className={cx('chart-container')}>

			</div>
		)
	};

	renderUserBar = () => {
		return (
			<div className={cx('user-bar')}>
				<div className={cx('user-bar__info-container')}>
					<div className={cx('user-bar__user-info')}>
						<div>
							姓名：陳o佑  年齡：40  病歷號碼：A1256890  透析床號：B02  其他相關系統性疾病：糖尿病、高血壓常態症狀高血壓常態症狀高血壓常態症狀
						</div>
					</div>
				</div>
				<DatePicker/>
			</div>
		)
	};

	render() {
		return (
			<div className={styles.container}>
				{this.renderUserBar()}
				<div className={styles.main}>
					<div className={cx('main__column', 'main__column--left')}>
						{this.renderFilterBar()}
						<div className={cx('chart-container')}>
							<SimulatorChart />
						</div>
					</div>
					<div className={cx('main__column', 'main__column--right')}>
						<div className={cx('simulator')}>
							<div className={cx('time')}>
								<span>Time: {'10:30'}</span>
							</div>
							<div className={cx('tag')}>
								<span>{'SBP Value'}</span>
							</div>
							<div className={cx('section')}>
								<div className={tcx('table-default')}>
									<div className={tcx('header')}>
										<div className={tcx('cell')}>實際</div>
										<div className={tcx('cell')}>預測</div>
										<div className={tcx('cell')}>誤差</div>
									</div>
									<div className={tcx('body')}>
										{/*<div className={tcx('row')}></div>*/}
									</div>
								</div>
							</div>
							<div className={cx('tag')}>
								<span>Value</span>
							</div>
							<div className={cx('section')}>
								<FormSBP/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
