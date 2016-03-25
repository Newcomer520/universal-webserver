import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import demo27Styles from './demo27.css'
import tableStyle from 'app/css/tables.css'
import componentStyle from 'app/css/components.css'
import transitionStyle from './transition.css'

import FormSBP from 'components/Forms/FormSBP'
import SimulatorChart from 'components/SimulatorChart'
import Select from 'react-select'
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import UserBar from 'components/UserBar'

// actioncreators
import { actions as filters } from 'actions/simulate-action'
import TYPES from 'constants/action-types'
import CSSModules from 'react-css-modules'

const styles = { ...tableStyle, ...componentStyle, ...demo27Styles }

function observorLabel(observor) {
	switch (observor) {
		case TYPES.SIMULATE_TYPE_SBP:
			return 'SBP'
	}

	return 'null'
}

function mapStateToProps(state) {
	const { simulate } = state
	const categories = simulate.get('categories')
	const types = simulate.get('types')
	const ret = {
		categories: [],
		selectedCategory: simulate.get('selectedCategory'),
		types: [],
		selectedType: simulate.get('selectedType'),
		observor: simulate.get('observor'),
		obTime: simulate.get('obTime'),
		requestStatus: simulate.get('requestStatus')
	}

	categories.forEach((label, key) => ret.categories.push({ label, value: key }))
	types && types.forEach((label, key) => ret.types.push({ label, value: key }))

	return ret
}

function bindDispatchToActions(dispatch) {
	return {
		actions: bindActionCreators({ ...filters }, dispatch)
	}
}

function SimulateForm(props) {
	const { observor } = props
	switch (observor) {
		case TYPES.SIMULATE_TYPE_SBP:
			return <FormSBP />
		default:
			return <div/>
	}
}

@connect(
	mapStateToProps,
	bindDispatchToActions
)
@CSSModules(styles)
export default class extends Component {
	handleSelectType = (selected) => {
		const { actions: { selectType }, selectedType } = this.props
		if (selected.value === selectedType) { // do not trigger the action if value is the same
			return
		}
		selectType(selected)
	};

	renderFilterBar = () => {
		const { actions: { selectCategory, selectType } } = this.props
		return (
			<div styleName="filter-bar">
				<Select
					clearable={false}
					searchable={false}
					placeholder="項目"
					styleName="dropdown"
					options={this.props.categories}
					value={this.props.selectedCategory}
					onChange={selectCategory}/>
				<Select
					disabled={!this.props.types || this.props.types.length <= 0}
					clearable={false}
					searchable={false}
					placeholder="細項"
					styleName="dropdown"
					options={this.props.types}
					value={this.props.selectedType}
					onChange={this.handleSelectType}/>
			</div>
		)
	};

	renderSimulator = () => {
		const { requestStatus, selectedType, observor, obTime } = this.props

		if (requestStatus == null) {
			return null
		} else if (selectedType == TYPES.SIMULATE_TYPE_TIME_SERIES) {
			return null
		}
		const s = {
			position: 'absolute',
			top: '0',
			left: '0',
			right: '0',
			bottom: '0'
		}
		return (
			<div key={observor} styleName="simulator" style={s}>
				<div styleName="time">
					<span>Time: {obTime}</span>
				</div>
				<div styleName="tag">
					<span>{observorLabel(observor)}</span>
				</div>
				<div styleName="section">
					<div styleName="table-default">
						<div styleName="header">
							<div styleName="cell">實際</div>
							<div styleName="cell">預測</div>
							<div styleName="cell">誤差</div>
						</div>
						<div styleName="body">
							<div styleName="row">

							</div>
						</div>
					</div>
				</div>
				<div styleName="tag">
					<span>Value</span>
				</div>
				<div styleName="section-form">
					<SimulateForm observor={observor}/>
				</div>
			</div>
		)
	};

	defaultContent = () => {
		const svgHeight = 400
		const svgWidth = 800
		const svgLinePointDisplay = true
		const points = [
			{ "x": 1,   "y": 100},
			{ "x": 20,  "y": 221},
			{ "x": 50,  "y": 12},
			{ "x": 60,  "y": 142},
			{ "x": 80,  "y": 10},
			{ "x": 100, "y": 246},
			{ "x": 150, "y": 24},
			{ "x": 200, "y": 246},
			{ "x": 250, "y": 24},
			{ "x": 300, "y": 246}
		]
		const predictPoints = [
			{ "x": 1,   "y": 100},
			{ "x": 50,  "y": 221},
			{ "x": 51,  "y": 100},
			{ "x": 120,   "y": 290},
			{ "x": 121,  "y": 80},
			{ "x": 300,  "y": 210}
		]

		return (
			<div styleName="content">
				<div styleName="column-left">
					<div styleName="chart-container">
						<SimulatorChart
							height={svgHeight}
							width={svgWidth}
							points={points}
							pointsDisplay={svgLinePointDisplay}
							predictPoints={predictPoints}/>
					</div>
					<p styleName="comment">
						胰島素可增加葡萄糖的利用，加速葡萄糖的無氧酵解和有氧氧化，抑制糖元分解和糖異生而降低血糖，
						臨床上主要用于胰島素依賴型糖尿病以及部分非胰島素依賴型糖尿病的治療也可用於細胞內缺鉀的治療
						，抑制糖元分解和糖異生而降低血糖，臨床上用於胰島素依賴型糖尿病以及部分非胰島素依賴型糖尿病
						的治療。
					</p>
				</div>
				<div styleName="column-right">
					<ReactCSSTransitionGroup
						transitionAppear={true}
						transitionName={transitionStyle}
						transitionAppearTimeout={500}
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}>
						{this.renderSimulator()}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		)
	};

	timeSeriesContent = () => {
		return <div styleName="content"></div>
	};

	renderMainContent = () => {
		const { selectedType } = this.props

		switch (selectedType) {
			default:
				return this.defaultContent()
			case TYPES.SIMULATE_TYPE_TIME_SERIES:
				return this.timeSeriesContent()
		}

	};

	render() {
		return (
			<div styleName="container">
				<UserBar/>
				<div styleName="main">
					{this.renderFilterBar()}
					{this.renderMainContent()}
				</div>
			</div>
		)
	}
}
