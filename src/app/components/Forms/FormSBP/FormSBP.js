import React, { Component } from 'react'
import classnames from 'classnames/bind'
import tableStyle from 'app/css/tables.css'
import componentStyle from 'app/css/components.css'
import formStyle from './formSBP.css'
import Button from 'components/Buttons/ButtonDefault'
import { reduxForm } from 'redux-form'
import CSSModules from 'react-css-modules'
import { compose } from 'redux'

const styles = { ...tableStyle, ...componentStyle, ...formStyle }

// message Request {
// 	required int32 time = 1;
// 	required double age = 2;
// 	required double uf = 3;
// 	required double conductivity = 4;
// 	required double dia_temp_value = 5;
// 	required double temperature = 6;
// 	required int32 dm = 7;
// 	required string gender = 8;
// 	required double d_weight_ratio = 9;
// 	required int32 bd_median = 10;
// }
// "age":<age>,
// "uf":<uf>,
// "conductivity":<conductivity>,
// "dia_temp_value":<dia_temp_value>,
// "temperature":<temperature>,
// "dm":<dm>,
// "gender":<gender>, // format ('F'/'M')
// "d_weight_ratio":<d_weight_ratio>,
// "bd_median":<uf>

const FormRowWithoutStyle = ({ name, value, type = 'text', field }) =>
	(
		<div styleName="row">
			<div styleName="cell">{name}</div>
			<div styleName="cell">{value}</div>
			<div styleName="cell">
				<input type={type} {...field}/>
			</div>
		</div>
	)

const FormRow = CSSModules(FormRowWithoutStyle, styles)

const enhance = compose(
	reduxForm({ form: 'sbp', fields: ['time', 'age', 'uf', 'conductivity', 'diaTemp', 'temperature', 'dm', 'gender', 'dWeightRatio', 'bdMedian'] }),
	CSSModules(styles)
)

@enhance
export default class FormSBP extends Component {

	handleSubmit = e => {
		e.preventDefault()

		return false
	};

	handleReset = e => {
		e.preventDefault()

		return false
	};

	renderRow(name, value, type = "number", field) {
		return (
			<div styleName="row">
				<div styleName="cell">{name}</div>
				<div styleName="cell">{value}</div>
				<div styleName="cell">
					<input type={type} {...field}/>
				</div>
			</div>
		)
	}

	render() {
		const { fields } = this.props
		const btnStyle = { width: '150px' }
		const {
			uf
		} = fields

		return (
			<form styleName="container" onSubmit={this.handleSubmit}>
				<div styleName="table-default">
					<div styleName="header">
						<div styleName="cell">項目</div>
						<div styleName="cell">實際</div>
						<div styleName="cell">模擬</div>
					</div>
					<div styleName="body">
						<FormRow name="UF" value={uf.value} type="number" field={uf} />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
						<FormRow name="gender" value="male" type="number" />
					</div>
				</div>
				<div styleName="operations">
					<Button onClick={this.handleReset} style={btnStyle} styleName="primary">清除</Button>
					<Button onClick={this.handleSubmit} style={btnStyle} styleName="primary">模擬</Button>
				</div>

			</form>
		)
	}
}
