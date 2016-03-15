export const TYPES = {
	UNIVERSAL_LOAD: '//UNIVERSAL_LOAD\\'
}

export function setServerFetched() {
	return {
		type: TYPES.UNIVERSAL_LOAD,
		fetchAtBrowser: false
	}
}

export function disableFetchAtBrowser() {
	return {
		type: TYPES.UNIVERSAL_LOAD,
		fetchAtBrowser: false
	}
}

export function enableFetchAtBrowser() {
	return {
		type: TYPES.UNIVERSAL_LOAD,
		fetchAtBrowser: true
	}
}
