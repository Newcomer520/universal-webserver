import React, { Component } from 'react'
import { reducer as formReducer, reduxForm } from 'redux-form'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from 'actions/logout-action'

// import comonents from material-ui
import FetchCard from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import LogoutButton from 'material-ui/lib/raised-button'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import CircularProgress from 'material-ui/lib/circular-progress';

//Recaptcha
import Recaptcha from 'components/Recaptcha'

// loading icon
import { TYPES as FETCH_STATUS_TYPES} from 'actions/fetch-status-action'
const { FETCH_STATUS_REQUESTING, FETCH_STATUS_SUCCESS, FETCH_STATUS_FAILED } = FETCH_STATUS_TYPES


const mapStateToProps = (state) => {
	return { fetch_status: state.fetchStatus }
}
@connect(mapStateToProps, dispatch => ({ actions: bindActionCreators({ logout }, dispatch) }))
export default class FetchStatus extends Component {
	static propTypes = {
		actions: React.PropTypes.object
	}
	requestLogout = () => {
		// useing boundAction to trigger middlewares
		const { logout } = this.props.actions
		logout()
	}
	render() {
		const { data, status } = this.props.fetch_status
		let objectLength = Object.keys(data).length
		let renderComponent
		const styles = require('./FetchStatus.css')
		switch(status){
			case FETCH_STATUS_REQUESTING:
				renderComponent = <CircularProgress mode="indeterminate" size={2}/>
				break
			case FETCH_STATUS_SUCCESS:
				renderComponent = Object.keys(data).map(
					key => {
						return (
							<ListItem
								key={objectLength--}
								primaryText={key}
								secondaryText={data[key].toString()}
								rightIcon={<ActionInfo />}
							/>
						)
					}
				)
				break
			case FETCH_STATUS_FAILED:
				renderComponent = <ListItem primaryText={'Fetch data failed'} rightIcon={<ActionInfo />} />
				break;
		}
		return (
			<div key={'fetchPage'}>
				<FetchCard className={styles['FetchStatus']}>
					<CardTitle title="FetchStatus" subtitle="fetch demo"/>
					<List subheader="Response data from '/api/status' ">
						{
							renderComponent
						}
					</List>
					<div className={styles['FetchStatus__buttonsWrapper']}>
						<LogoutButton label="Logout" primary={true} onClick={this.requestLogout} />
					</div>
				</FetchCard>
			</div>
		)
	}
}
