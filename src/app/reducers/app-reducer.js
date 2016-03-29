import TYPES from 'constants/action-types'
import { fromJS } from 'immutable'
const initState = fromJS({
  isBusy: false
})

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case TYPES.APP_LOADING:
      return state.set('isBusy', !!action.isBusy)
  }

  return state
}
