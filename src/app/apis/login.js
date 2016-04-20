import fetchObject from '../utils/fetch'

export default function login(username, password) {
  const url = `/api/${__API_VERSION__}/auth/login`
  const options = { method: 'post', body: JSON.stringify({ username, password }), refreshOnce: false }
  return fetchObject(url, options)
}
