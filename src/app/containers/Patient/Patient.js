import React, { Component } from 'react'
import bg from './images/GUI_0317_3x-05.png'
import CSSModules from 'react-css-modules'
import styles from './patient.css'

@CSSModules(styles)
export default class Patient extends Component {
	render() {
    const style = {
      width: '90%',
    }
		return (
      <div styleName="container">
        <img style={style} src={bg} />
      </div>
    )
	}
}
