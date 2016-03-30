import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

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
import { actions as filters, fetchActual } from 'actions/simulate-action'
import TYPES from 'constants/action-types'
import CSSModules from 'react-css-modules'

const styles = { ...tableStyle, ...componentStyle, ...demo27Styles }

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

function mapStateToProps(state) {
  const { simulate } = state
  const categories = simulate.get('categories')
  const types = simulate.get('types')
  const actual = simulate.get('actual').toJS()
  const predict = simulate.get('predict').toJS()

  const ret = {
    categories: [],
    selectedCategory: simulate.get('selectedCategory'),
    types: [],
    selectedType: simulate.get('selectedType'),
    observor: simulate.get('observor'),
    obTime: simulate.get('obTime'),
    obActual: '─',
    obPredict: '─',
    obDiff: '─',
    requestStatus: simulate.get('requestPredictStatus'),
    actualPoints: Object.keys(actual).map(p => ({ x: actual[p].time, y: actual[p].sbp })),
    predict,
  }

  categories.forEach((label, key) => ret.categories.push({ label, value: key }))
  types && types.forEach((label, key) => ret.types.push({ label, value: key }))

  if (ret.observor && ret.obTime) {
    let tempData
    tempData = simulate.get('actual').get(ret.obTime)
    tempData && (ret.obActual = tempData.get(observorKey(ret.observor)))
  } else {
    ret.obTime = '─'
  }

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
  static preloader = fetchActual;
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
          {
            (selectedType === TYPES.SIMULATE_TYPE_SBP) &&
            <div styleName="legend-container">
              <div styleName="actual-legend">實際血壓</div>
              <div styleName="predict-legend">預測範圍</div>
              <div styleName="simulate-legend">模擬範圍</div>
            </div>
          }
      </div>
    )
  };

  renderSimulator = () => {
    const { requestStatus, selectedType, observor, obTime, obActual, obPredict, obDiff } = this.props
    if (requestStatus == null) {
      return null
    } else if (observor == TYPES.SIMULATE_TYPE_TIME_SERIES) {
      console.log('time series')
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
                <div styleName="cell">{obActual}</div>
                <div styleName="cell">{obPredict}</div>
                <div styleName="cell">{obDiff}</div>
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
    const startTime1 = moment("2016-10-20 8:30", "YYYY-MM-DD HH:mm")
    const startTime2 = moment("2016-10-20 8:30", "YYYY-MM-DD HH:mm")

    const points = [
      { "x": startTime1.valueOf(),              "y": 111.72106625822656},
      { "x": startTime1.add(30,'m').valueOf(),  "y": 120},
      { "x": startTime1.add(28,'m').valueOf(),  "y": 139},
      { "x": startTime1.add(32,'m').valueOf(),  "y": 118},
      { "x": startTime1.add(15,'m').valueOf(),  "y": 123}//,
      // { "x": startTime1.add(45,'m').valueOf(), "y": 108},
      // { "x": startTime1.add(30,'m').valueOf(), "y": 90},
      // { "x": startTime1.add(30,'m').valueOf(), "y": 106},
      // { "x": startTime1.add(30,'m').valueOf(), "y": 99},
      // { "x": startTime1.add(30,'m').valueOf(), "y": 106}
    ]

    const svgHeight = 400
    const svgWidth = 800
    const svgLinePointDisplay = true

    return (
      <div styleName="content">
        <div styleName="column-left">
          <div styleName="chart-container">
            {/*<SimulatorChart
                height={svgHeight}
                width={svgWidth}
                points={this.props.actualPoints}
                pointsDisplay={svgLinePointDisplay}
                predictFitPoints={predictFitPoints}
                predictUprPoints={predictUprPoints}
                predictLwrPoints={predictLwrPoints}
                simFitPoints={simFitPoints}
                simUprPoints={simUprPoints}
                simLwrPoints={simLwrPoints}/>*/}
          </div>
          <div styleName="comment-label">提醒</div>
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

