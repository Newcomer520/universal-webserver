import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import listensToClickOutside from 'react-onclickoutside/decorator'
import styles from './styles.css'


@listensToClickOutside()
export default class DropDown extends Component {
	static propTypes = {
		disabled: PropTypes.bool,
		placeholder: PropTypes.string,
		list:PropTypes.array,
		callback: PropTypes.func,
		selectedIndex: PropTypes.number,
	};

	static defaultProps = {
		placeholder: 'Select..',
		disabled: false,
		selectedIndex: 0
	};

	state = {
		visible: false,
		selectedIndex: -1,
		hoverIndex: -1
	};

	componentWillMount() {
		this.props.selectedIndex != -1 && this.setState({ selectedIndex: this.props.selectedIndex })
	}
	componentDidMount() {

	}
	componentWillReceiveProps(newProps) {
		if (newProps.list != this.props.list) {
			this.setState({
				hoverIndex: -1,
				selectedIndex: newProps.selectedIndex? newProps.selectedIndex: -1
			})
		}
	}
	toggle = e => {
		this.setState({
			visible: !this.state.visible,
			hoverIndex: -1
		})
	};

	handleClickOutside = e => {
		this.state.visible && this.setState({ visible: false })
	};

	handleSelectItem = (idx, e) => {
		this.setState({ selectedIndex: idx, visible: false })
		const { callback } = this.props
		if (typeof callback != 'function') {
			return
		}
		callback(idx)
	};

	setHoverIndex = (idx, e) => {
		this.setState({ hoverIndex: idx })
	};

	renderItems = items => {
		const { selectedIndex, hoverIndex } = this.state
		return items.map((item, idx) => {
			const cls = cx('item', {
				active: selectedIndex == idx,
				selected: hoverIndex == idx
			})
			return (
				<div className={cls} key={idx} onClick={this.handleSelectItem.bind(this, idx)}>
					{item}
				</div>
			)
		})
	};

	handleKeyDown = e => {
		const { visible } = this.state
		const { selectedIndex, hoverIndex } = this.state
		// 38: up 40: down  27: escape
		if (e.which == 27) {
			return this.setState({ visible: false })
		}
		else if (e.which != 38 && e.which != 40 && e.which != 13) {
			return
		} else if (e.which == 38 && visible && hoverIndex == -1) {
			return
		} else if (e.which == 40 && visible && hoverIndex == this.props.children.length - 1) {
			return
		}
		e.preventDefault()
		switch (e.which) {
			case 38:
				// this.setState({ selectedIndex: selectedIndex - 1 })
				this.setHoverIndex(Math.max(hoverIndex - 1, -1))
				break
			case 40:
				if (!visible) {
					this.setState({ visible: true })
				} else {
					if (selectedIndex + 1 <= this.props.children.length - 1) {
						this.setHoverIndex(hoverIndex + 1)
					}
				}
				break
			case 13:
				if (!visible) {
					this.setState({ visible: true })
				} else {
					this.handleSelectItem(hoverIndex)
				}
				break
		}
		return false
	};

	render() {
		const { visible } = this.state
		const containerCls = cx('ui selection dropdown', {
			'active visible': visible,
			disabled: this.props.disabled
		})
		const menuCls = cx("menu", {
			[styles.dropdown]: true,
			[styles.toggle]: visible,
		})
		const { list } = this.props
		const currentValueStyle = (this.state.selectedIndex >= 0 && list && Array.isArray(list) && list.length - 1 >= this.state.selectedIndex)?
			"text": "default text"
		const currentValue =  (this.state.selectedIndex >= 0 && list && Array.isArray(list) && list.length - 1 >= this.state.selectedIndex)?
			list[this.state.selectedIndex] : this.props.placeholder
		return (
			<div style={this.props.style} className={containerCls} onClick={this.toggle} tabIndex="0" onKeyDown={this.handleKeyDown}>
				{/*<input type="hidden" name="gender"/>*/}
				<i className="dropdown icon"></i>
				<div className={currentValueStyle}>{currentValue}</div>
				<div className={menuCls}>
					{this.renderItems(this.props.children)}
				</div>
			</div>
		)
	}
}

