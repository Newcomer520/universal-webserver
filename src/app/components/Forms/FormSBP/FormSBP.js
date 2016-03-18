import React, { Component } from 'react'
import classnames from 'classnames/bind'
import tableStyle from 'app/css/tables.css'
import componentStyle from 'app/css/components.css'
import styles from './formSBP.css'
import Button from 'components/Buttons/ButtonDefault'

const cx = classnames.bind(styles)
const tcx = classnames.bind(tableStyle)
const ccx = classnames.bind(componentStyle)

const PropertyRow = props => {
	return (
		<div className={tcx('row')}>
			<div className={tcx('cell')}>{props.name}</div>
			<div className={tcx('cell')}>{props.value}</div>
			<div className={tcx('cell')}>
				<input type="number"/>
			</div>
		</div>
	)
}

export default class FormSBP extends Component {

	handleSubmit = e => {
		e.preventDefault()

		return false
	};

	handleReset = e => {
		e.preventDefault()

		return false
	};

	render() {

		const headerClassName = `${tcx('header')} `
		const btnStyle = { width: '150px' }
		return (
			<form className={cx('container')} onSubmit={this.handleSubmit}>
				<div className={tcx('table-default')}>
					<div className={headerClassName}>
						<div className={tcx('cell')}>項目</div>
						<div className={tcx('cell')}>實際</div>
						<div className={tcx('cell')}>模擬</div>
					</div>
					<div className={tcx('body')}>

					</div>
				</div>
				<div className={cx('operations')}>
					<Button onClick={this.handleReset} style={btnStyle} className={ccx("primary")}>清除</Button>
					<Button onClick={this.handleSubmit} style={btnStyle} className={ccx("primary")}>模擬</Button>
				</div>

			</form>
		)
	}
}
