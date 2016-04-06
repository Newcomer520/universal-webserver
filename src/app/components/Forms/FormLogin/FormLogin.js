import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { reduxForm } from 'redux-form'
import styles from './form-login.css'

@CSSModules(styles)
export default class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    return false
  };

  render() {
    return (
      <form styleName="form-login" onSubmit={this.handleSubmit}>
        <input styleName="input" placeholder="請輸入帳號" />
        <input styleName="input" type="password" placeholder="請輸入密碼" />
        <div styleName="row-buttons">
          <button styleName="button" type="submit">送出</button>
          <button styleName="button" type="button">清除</button>
        </div>
      </form>
    )
  }
}
