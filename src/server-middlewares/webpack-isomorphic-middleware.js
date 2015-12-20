/**
 * Implement isomorphic middleware tool
 *
 */
export default function(req, res, next) {
	if (__DEV__) {
		webpackIsomorphicTools.refresh()
	}

	next()
}
