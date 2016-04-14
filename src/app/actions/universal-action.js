import TYPES from 'constants/action-types'

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

export function setAccessToken(token) {
  return {
    type: TYPES.UNIVERSAL_SET_TOKEN,
    token
  }
}
