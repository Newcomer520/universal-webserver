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
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import UserBar from 'components/UserBar'
import selector from './selector'
import tsFake from './time-series-fake-data'

// actioncreators
import { actions as filters, fetchActual, setObTime, fetchActualAndPredict } from 'actions/simulate-action'
import TYPES from 'constants/action-types'
import CSSModules from 'react-css-modules'

import moment from 'moment'

const styles = { ...tableStyle, ...componentStyle, ...demo27Styles }

// @todo: THIS LABEL HAS BEEN REMOVE
// @todo: need to refactor observorLabel & observorKey
function observorLabel(observor) {
  switch (observor) {
    case TYPES.SIMULATE_TYPE_SBP:
      return 'SBP'
  }

  return 'null'
}

function observorKey(observor) {
  switch (observor) {
    case TYPES.SIMULATE_TYPE_SBP:
      return 'sbp'
  }
  return 'null'
}

function bindDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators({ ...filters, setObTime }, dispatch)
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
  state => selector(state),
  // mapStateToProps,
  bindDispatchToActions
)
@CSSModules(styles)
export default class extends Component {
  static preloader = fetchActualAndPredict;
  handleSelectType = (selected) => {
    const { actions: { selectType }, selectedType } = this.props
    if (selected.value === selectedType) { // do not trigger the action if value is the same
      return
    }
    selectType(selected)
  };

  renderFilterBar = () => {
    const { actions: { selectCategory, selectType }, selectedType } = this.props
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
          <div styleName="legend-container">
            <div styleName="actual-legend">實際血壓</div>
            <div styleName="predict-legend">預測範圍</div>
            {
              (selectedType === TYPES.SIMULATE_TYPE_SBP) &&
              <div styleName="simulate-legend">模擬範圍</div>
            }
          </div>
      </div>
    )
  };

  renderSimulator = () => {
    const { requestStatus, selectedType, observor, obTime, obActual, obPredict, obDiff } = this.props
    if (requestStatus == null) {
      return null
    } else if (observor == TYPES.SIMULATE_TYPE_TIME_SERIES) {
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
          <span>時間：{obTime}</span>
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
    const { actual, predict, simulate, obRawTime } = this.props
    const { actions: { setObTime } } = this.props
    const svgHeight = 300
    const svgWidth = 750
    return (
      <div styleName="content">
        <div styleName="column-left">
          <div styleName="chart-container">
            <SimulatorChart
              height={svgHeight}
              width={svgWidth}
              actualPoints={actual}
              predictPoints={predict}
              simulatePoints={simulate}
              predictTSPoints={null}
              clickTimeCallback={setObTime}
              currentTime={obRawTime} />
          </div>
          <div styleName="comment-label">提醒</div>
          <p styleName="comment">
            在SBP最低點欲提高1mmHg，可調整<br/>
            1. 電解質濃度 -0.68<br/>
            2. 機器溫度 0.48<br/>
            3. 脫水係數 0.87<br/>
            (數值為調整之最大值，實際需參考當時患者之機器參數設定)
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
    const { actual, predict, obRawTime } = this.props
    const { actions: { setObTime } } = this.props
    const svgHeight = 400
    const svgWidth = 1000
    const points = tsFake.map((f, i) => {
      return { x: actual.rows[0].x + 1000 * 60 * i, y: f.y }
    })

    const predictTS = { key: actual.rows[0].x, rows: points }

    return (
      <div styleName="content-time-series">
        <SimulatorChart
          height={svgHeight}
          width={svgWidth}
          actualPoints={actual}
          predictPoints={null}
          simulatePoints={null}
          predictTSPoints={predictTS}
          clickTimeCallback={setObTime}
          currentTime={obRawTime} />
      </div>
    )
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

