import React, { Component, PropTypes } from 'react'
import styles from './style.css'
import moment from 'moment'
import Select from 'react-select'
import CSSModules from 'react-css-modules'

@CSSModules(styles)
export default class DatePicker extends Component {

  static propTypes = {
    date: PropTypes.array.isRequired,
    clickTimeCallback: PropTypes.func,
  };

  constructor(props) {
    super(props)
    this.dateUpdate(props)
  }

  componentWillReceiveProps(nextProps) {
    this.dateUpdate(nextProps)
  }

  dateUpdate = (props) => {
    if (props && props.date && props.date.length && props.date.length > 0) {
      this.state = {
        currentTime: { value: props.date[0] },
        dateCount: props.date.length,
        dateArray: props.date.map((date) => (
          { value: date, label: moment(date, 'x').format('YYYY-MM-DD') }
        ))
      }
    } else {
      console.warn('No date has been provided to the DatePicker component')
      this.state = {
        currentTime: { value: undefined },
        dateCount: 0,
        dateArray: []
      }
    }
  };

  //-------------------------------------------------------------------------
  // arrow of both side for change to previous and next date
  //-------------------------------------------------------------------------
  dateInc = () => {
    const { dateArray, dateCount, currentTime } = this.state
    const currentIndex = dateArray.findIndex(
      (obj) => (obj.value === currentTime.value)
    )
    if (currentIndex < dateCount - 1) {
      this.dateChange(dateArray[currentIndex + 1], currentIndex + 1)
    }
  };

  dateDec = () => {
    const { dateArray, currentTime } = this.state
    const currentIndex = dateArray.findIndex(
      (obj) => (obj.value === currentTime.value)
    )
    if (currentIndex > 0) {
      this.dateChange(dateArray[currentIndex - 1], currentIndex - 1)
    }
  };

  //-------------------------------------------------------------------------
  // dropdown change handler
  // argument format: newTime { value: new Date().valueOf(), label: 'YYYY-MM-DD' }
  //-------------------------------------------------------------------------
  dateChange = (newTime, idx) => {
    const { dateArray } = this.state
    if (newTime && 'value' in newTime) {
      const currentIndex = (idx) || dateArray.findIndex(
          (obj) => (obj.value === newTime.value)
        )
      this.setState({ currentTime: newTime })
      this.clickCallback(newTime.value, currentIndex)
    }
  };

  //-------------------------------------------------------------------------
  // date change callback
  //-------------------------------------------------------------------------
  clickCallback = (d, i) => {
    const { clickTimeCallback } = this.props
    if (clickTimeCallback && typeof clickTimeCallback === 'function') {
      this.props.clickTimeCallback(d, i)
    }
  };

  render() {
    return (
      <div styleName="date-picker">
        <i className="caret left icon big" onClick={this.dateDec}></i>
        <div styleName="current-pick">
          <Select
            name="select-date"
            styleName="select-value"
            className="selectBody"
            clearable={false}
            searchable={false}
            disabled={!!!this.state.currentTime.value}
            placeholder={''}
            value={this.state.currentTime.value}
            options={this.state.dateArray}
            onChange={this.dateChange} />
        </div>
        <i className="caret right icon big" onClick={this.dateInc}></i>
      </div>
    )
  }
}
