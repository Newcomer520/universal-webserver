import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'
/**
 * save the token in req.token
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
export default function (req, res, next) {
	const rule = /^Bearer\s(.+)$/
	req.token = req.cookies[COOKIE_AUTH_TOKEN] || ( rule.test(req.get('Authorization'))? rule.exec(req.get('Authorization'))[1]: null )
	req.userInfo = authHelper.recoverToken(req.token)
	next()
}
