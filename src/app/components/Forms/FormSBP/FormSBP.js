import React, { Component } from 'react'
import classnames from 'classnames/bind'
// import tableStyle from 'app/css/tables.css'
import componentStyle from 'app/css/components.css'
import formStyle from './formSBP.css'
import Button from 'components/Buttons/ButtonDefault'
import { reduxForm } from 'redux-form'
import CSSModules from 'react-css-modules'
import { compose } from 'redux'
import cloneWithProps from 'react-addons-clone-with-props'
import { connect } from 'react-redux'
import validate from './validator'
import selector, { fieldNames } from './selector'

const styles = { ...componentStyle, ...formStyle }



const FormRowWithoutStyle = ({ key, name, value, type = 'text', field, submitted = true, children }) =>
  (
    <div key={key} styleName={!field.valid && submitted? 'row-error': 'row'}>
      <div styleName="cell">{name}</div>
      <div styleName="cell">{value}</div>
      <div styleName="cell">
      {
        children
        ? cloneWithProps(children, { ...field })
        : <input styleName={!field.valid && submitted? 'shadow-input-error': 'shadow-input'} type={type} {...field}/>
      }
      </div>
      {
        <div styleName={!field.valid && submitted? 'error-box': 'error-box-hidden'}>
          {field.error}
        </div>
      }
    </div>
  )

const FormRow = CSSModules(FormRowWithoutStyle, styles)

const enhance = compose(
  reduxForm({
    form: 'sbp',
    fields: Object.keys(fieldNames),
    validate,
  }),
  connect(
    // ({ simulate }) => {
    //   const time = simulate.get('obTime')
    //   const currentActual = time? simulate.get('actual').get(time.toString()): null
    //   const actuals = Object.keys(fieldNames).reduce((prevResult, currentField) => {
    //     prevResult[currentField] = actualValueGenerator(currentField, currentActual)
    //     return prevResult
    //   }, {})
    //   return { actuals, obTime: time }
    // }
    state => selector(state)
  ),
  CSSModules(styles)
)

@enhance
export default class FormSBP extends Component {
  state = {
    submitted: false
  };

  handleSubmit = e => {
    e.preventDefault()
    !this.state.submitted && this.setState({ submitted: true })

    const { valid } = this.props
    if (!valid) {
      return false
    }



    return false
  };

  handleReset = e => {
    e.preventDefault()
    this.setState({ submitted: false }, () => this.props.resetForm())
    return false
  };

  renderRows = () => {
    const { fields, actuals } = this.props
    const { submitted } = this.state

    return Object.keys(fields).map((f, idx) => {
      if (idx > 6) {
        return null
      }
      const key = fields[f].name
      const actual = actuals[key]
      return (
        <FormRow
          key={key}
          name={fieldNames[key]}
          value={actuals[key]}
          type="number"
          field={fields[f]}
          submitted={submitted}/>
      )
    })

  };

  render() {
    const { fields, actuals, obTime } = this.props
    const btnStyle = { width: '150px' }
    const disabled = !!obTime === false

    return (
      <form styleName="container" onSubmit={this.handleSubmit}>
        <div styleName="table-default">
          <div styleName="header">
            <div styleName="cell">項目</div>
            <div styleName="cell">實際</div>
            <div styleName="cell">模擬</div>
          </div>
          <div styleName="body">
            {this.renderRows()}
          </div>
        </div>
        <div styleName="operations">
          <Button onClick={this.handleReset} style={btnStyle} styleName="primary">清除</Button>
          <Button onClick={this.handleSubmit} style={btnStyle} styleName="primary" disabled={disabled}>模擬</Button>
        </div>

      </form>
    )
  }
}



