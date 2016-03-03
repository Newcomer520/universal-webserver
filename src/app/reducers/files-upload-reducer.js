import Immutable, { Set, OrderedMap } from 'immutable'
import { TYPES } from 'actions/files-upload-action'

const { FILE_UPLOAD_UNION_FILES_BY_MD5, FILE_UPLOAD_REQUESTING, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAILED, FILE_UPLOAD_REMOVE_FILE } = TYPES
const initState = new OrderedMap()

export function filesSelectedReducer(state = initState, action) {
	switch (action.type) {
		case FILE_UPLOAD_UNION_FILES_BY_MD5:
			action.fileInfos.forEach(fi => {
				if (state.has(fi.key)) {
					return
				}
				state = state.set(fi.key, fi.value)
			})
			return state
		case FILE_UPLOAD_REMOVE_FILE:
			return state.delete(action.key)
	}

	return OrderedMap.isOrderedMap(state)? state: new OrderedMap()
}

export function filesUploadStatus(state = null, action) {
	switch (action.type) {
		case FILE_UPLOAD_REQUESTING:
		case FILE_UPLOAD_SUCCESS:
		case FILE_UPLOAD_FAILED:
			return action.type
	}
	return state
}
