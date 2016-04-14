
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CSSModules from 'react-css-modules'

import { login } from 'actions/login-action'
import styles from './login.css'
import FormLogin from 'components/Forms/FormLogin'

@CSSModules(styles)
export default class Login extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="container" >
        <FormLogin/>
      </div>
    )
  }
}
