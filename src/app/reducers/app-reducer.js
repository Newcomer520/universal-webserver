import TYPES from 'constants/action-types'
import { fromJS } from 'immutable'
export const initState = () => fromJS({
  currentTime: Date.now(),
  isBusy: false,
})

export default function appReducer(state = initState(), action) {
  switch (action.type) {
    case TYPES.APP_LOADING:
      return state.set('isBusy', !!action.isBusy)
    case TYPES.APP_UPDATE_TIME:
      return state.set('currentTime', action.currentTime)
  }

  return state
}
