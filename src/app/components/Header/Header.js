import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './header.css'
import logo from './images/logo.png'
import cx from 'classnames'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import { connect } from 'react-redux'

const NavItem = (props) => (
  <Link
    className={styles[`${props.image}`]}
    activeClassName={styles['selected']}
    to={props.to || '/'}>
    <div styleName="nav-text">{props.text}</div>
  </Link>
)

@connect(
  state => ({ username: state.auth.get('username') })
)
@CSSModules(styles)
export default class extends Component {
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  handleScroll(e) {

  }

  handleClickNav = (i, e) => {

  };

  renderNavBar = () => {
    return (
      <div styleName="nav-bar">
        <NavItem text="病患總覽" image="patient" to="patient"/>
        <NavItem text="儀表板" image="dashboard" to="dashboard" />
        <NavItem text="血液透析紀錄" image="report" to="record" />
        <NavItem text="血液透析檢驗" image="check" to="examination" />
        <NavItem text="風險評估" image="simulate" to="simulate"/>
      </div>
    )
  };

  renderRightSection = () => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm a')
    return (
      <div styleName="right-section">
        <div styleName="info">
          <span>{this.props.username}</span>
          <span>{currentDate}</span>
        </div>
        <img styleName="setting"/>
      </div>
    )
  };

  render() {
    return (
      <div styleName="header-container">
        <div styleName="header">
          <Link to="/"><img styleName="logo" src={logo}/></Link>
          {this.renderNavBar()}
          {this.renderRightSection()}
        </div>
      </div>
    )
  }
}


