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
    if ('date' in props && props.date.length > 0) {
      this.state = {
        currentTime: { value: this.props.date[0] },
        dateCount: this.props.date.length,
        dateArray: this.props.date.map((date) => (
          { value: date, label: moment(date, 'x').format('YYYY-MM-DD') }
        ))
      }
    } else {
      console.warn('No date has been provided to the DatePicker component')
      const date = moment()
      this.state = {
        currentTime: { value: date.valueOf() },
        dateCount: 1,
        dateArray: [{ value: date.valueOf(), label: date.format('YYYY-MM-DD') }]
      }
    }
  }

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
            value={this.state.currentTime.value}
            options={this.state.dateArray}
            onChange={this.dateChange} />
        </div>
        <i className="caret right icon big" onClick={this.dateInc}></i>
      </div>
    )
  }
}
