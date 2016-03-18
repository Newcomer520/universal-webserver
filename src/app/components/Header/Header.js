import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './header.css'
import logo from './images/logo.png'
import cx from 'classnames'

const NavItem = (props) => (
	// activeClassName={styles['nav-item--selected']}
	// style={{ backgroundImage: `url(${props.image})` }}
	<Link
		className={cx(styles['nav-item'], styles[`${props.image}`])}
		activeClassName={cx(styles['selected'])}
		to={props.to || '/'}>
		<div className={styles['nav-item__text']}>{props.text}</div>
	</Link>
)

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
			<div className={styles['nav-bar']}>
				<NavItem text="選擇病人" image="patient" to="patient"/>
				<NavItem text="儀表板" image="dashboard" to="dashboard" />
				<NavItem text="血液透析紀錄" image="report" to="record" />
				<NavItem text="血液透析檢驗" image="check" to="examination" />
				<NavItem text={<span>血液透析<br/>模擬與紀錄</span>} image="simulate" to="simulate"/>
			</div>
		)
	};

	renderRightSection = () => {
		return (
			<div className={styles['right-section']}>
				<div className={styles.info}>
					<span>Johnny@ehospital.com</span>
					<span>2015-08-22 13:40 pm</span>
				</div>
				<img className={styles.setting}/>
			</div>
		)
	};

	render() {
		return (
			<div className={styles['header-container']}>
				<div className={styles.header}>
					<Link to="/"><img className={styles.logo} src={logo}/></Link>
					{this.renderNavBar()}
					{this.renderRightSection()}
				</div>
			</div>
		)
	}
}


