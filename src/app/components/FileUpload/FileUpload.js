import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import classNames from 'classnames/bind'
import styles from './file-upload.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addFiles, uploadFiles, removeFile, TYPES } from 'actions/files-upload-action'
import Modal from 'react-modal'
import { spring, TransitionMotion, Motion } from 'react-motion'
const cx = classNames.bind(styles)
const { FILE_UPLOAD_REQUESTING, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAILED } = TYPES

@connect(
	state => ({
		files: state.files.entrySeq().map(entry => ({ key: entry[0], content: entry[1] })).toArray(),
		uploadStatus: state.uploadStatus
	}),
	dispatch => ({ actions: bindActionCreators({ addFiles, uploadFiles, removeFile }, dispatch)})
)
export default class FileUpload extends Component {
	constructor(props) {
		super(props)
		this.onDrop = this.onDrop.bind(this)
	}

	state = {
		isModalOpen: false
	};

	onOpenClick = e => {
		this.refs.dropzone.open()
	};

	onDrop(files) {
		if (this.props.uploadStatus !== null) {
			return
		}

		this.props.actions.addFiles(files)
	}

	handleUpload = e => {
		const { files } = this.props
		if (files.length == 0) {
			return this.setState({ isModalOpen: true })
		}
		const { actions: { uploadFiles } } = this.props
		const uploads = files.map(fileInfo => fileInfo.content)
		uploadFiles(uploads)
	};

	handleRemove = (key) => {
		const { actions: { removeFile } } = this.props
		removeFile(key)
	};

	renderModal = (content = 'Non-files selected.') => {
		const customStyles = {
			content : {
				top: '50%',
				left: '50%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
				padding: '0px'
			}
		}
		return (
			<Modal
				isOpen={this.state.isModalOpen}
				onRequestClose={this.closeModal}
				style={customStyles}
			>
				<div className="ui modal visible active scrolling" style={{ display: 'block !important', margin: '0px', position: 'initial'}}>
					<div className={cx('header ui', styles['bg-red'])}>Error</div>
				  <div className="content">
				    {content}
				  </div>
				</div>
			</Modal>
		)
	};

	closeModal = () => {
    this.setState({ isModalOpen: false });
  };

	render() {
		return(
			<div>
			{this.state.isModalOpen && this.renderModal()}
				<div className={styles.container}>
					<h1 className="ui header">File Upload</h1>
					<div className={styles['op-zone']}>
						<button className="ui orange button" onClick={this.onOpenClick} disabled={this.props.uploadStatus !== null}>Select Files</button>
						<button className={cx("ui blue button")} onClick={this.handleUpload}>Upload Files</button>
					</div>
					<Dropzone
						disableClick={true}
						ref="dropzone"
						onDrop={this.onDrop}
						multiple={true}
						className={styles['file-selector']}>
						<h3>Selected Files: </h3>
						<FileList files={this.props.files} onRemoveFile={this.handleRemove} />
						<div className={styles['file-selector__footer']}>Try dropping some files here, or click to select files to upload.</div>
					</Dropzone>
				</div>
			</div>
		)
	}
}

class FileList extends Component {
	static propTypes = {
		files: PropTypes.array.isRequired,
		onRemoveFile: PropTypes.func
	};
	willEnter = () => {
		return {
			y: 100
		}
	};
	willLeave = (previousStyle) => {
		const { style } = previousStyle
		return {
			x: spring(-100),
			y: 0,
			h: style.h
		}
	};
	mapTransitionStyle = (y) => (f) => ({
		key: f.key,
		data: f,
		style: {
			x: 0,
			y: y,
			h: 50
		}
	});
	renderItem = (config) => {
		const styles = {
			transform: `translate(${config.style.x}%, ${config.style.y}%)`,
			height: `${config.style.h}px`
		}
		return Math.abs(Math.round(config.style.x)) !== 100?
			<FileItem key={config.key} file={config.data} styles={styles} callbackRemove={this.props.onRemoveFile.bind(null, config.key)} />:
			(<Motion defaultStyle={{ h: config.style.h }} style={{ h: spring(0) }}>
			{
				inted => {
					const s = { ...styles, height: `${inted.h}px` }
					return <FileItem key={config.key} file={config.data} styles={s} callbackRemove={this.props.onRemoveFile.bind(null, config.key)} />
				}
			}
			</Motion>)
	};
	render() {
		const { files } = this.props
		return (
			<TransitionMotion
				willEnter={this.willEnter}
				willLeave={this.willLeave}
				styles={files.map(this.mapTransitionStyle(spring(0)))}
			>
			{
				intedStyles =>
				<ul className={styles['file-selector__list']}>
					{
						intedStyles.map(this.renderItem)
					}
				</ul>
			}
			</TransitionMotion>

		)
	}
}

class FileItem extends Component {
	static protoTypes = {
		file: PropTypes.object.isRequired,
		callbackRemove: PropTypes.func
	};
	render() {
		const { file } = this.props
		return (
			<li style={this.props.styles} className={cx(styles['file-selector__item'], 'item')}>
				<i className="file text outline icon"/>
				<span>{file.content.name}</span>
				<button className="ui compact icon red button" onClick={this.props.callbackRemove}>
					<i className="remove icon"></i>
				</button>
			</li>
		)
	}
}
