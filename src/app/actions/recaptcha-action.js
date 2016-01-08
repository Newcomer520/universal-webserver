export const SET_RECAPTCHA_ID = Symbol('set recaptcha id')
export const GET_RECAPTCHA_RESPONSE_SUCCESS = Symbol('get recaptcha response success')
export const GET_RECAPTCHA_RESPONSE_FAILED = Symbol('get recaptcha response failed')

export const set_recaptcha_id = (recaptcha_id) => {
	const type = SET_RECAPTCHA_ID
	return { recaptcha_id, type }
}

export const get_recaptcha_response_success = (token) => {
	const type = GET_RECAPTCHA_RESPONSE_SUCCESS
	return { token, type }
}

export const get_recaptcha_response_failed = () => {
	const type = GET_RECAPTCHA_RESPONSE_FAILED
	return { type }
}
