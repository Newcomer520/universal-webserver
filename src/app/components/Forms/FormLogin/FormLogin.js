import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { reduxForm } from 'redux-form'
import styles from './form-login.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login } from 'actions/login-action'


@connect(
  state => ({}),
  dispatch => ({ actions: bindActionCreators({ login }, dispatch) })
)
@reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  // initialValues: { username: 'dr', password: 'drp1w' },
})
@CSSModules(styles)
export default class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    const { fields: { username, password }, actions: { login } } = this.props
    login(username.value, password.value)
    return false
  };
  render() {
    const { fields: { username, password } } = this.props
    return (
      <form styleName="form-login" onSubmit={this.handleSubmit}>
        <input styleName="input" placeholder="請輸入帳號" {...username}/>
        <input styleName="input" type="password" placeholder="請輸入密碼" {...password}/>
        <div styleName="row-buttons">
          <button styleName="button" type="submit">送出</button>
          <button styleName="button" type="button">清除</button>
        </div>
      </form>
    )
  }
}
