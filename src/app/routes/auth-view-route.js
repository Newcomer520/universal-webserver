import React, { Component } from 'react'
import { Route } from 'react-router'
import AuthView from 'components/AuthView'
import { AuthRequired, requireLogin, requireFetch } from './index'
import { fetchData } from 'actions/auth-data-action'

export default store => (
	<Route onEnter={requireFetch(fetchData, { authRequired: true, store, reduxState: 'protectedData' })} path="protected" component={AuthView}/>
)
