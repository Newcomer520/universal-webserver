import { effects } from 'redux-saga'
import { TYPES } from 'actions/files-upload-action'
import getMD5 from '../utils/file-md5'
import fetch from 'isomorphic-fetch'
import delay from '../utils/delay'

const { take, fork, call, put } = effects
const uploadUrl = '/api/fileupload'

function* filesTask(files) {

	if (!Array.isArray(files)) {
		return
	}

	const fileInfos = []
	for (let file of files) {
		const { md5 } = yield call(getMD5, file)
		fileInfos.push({ key: md5, value: file})
	}

	yield put({ type: TYPES.FILE_UPLOAD_UNION_FILES_BY_MD5, fileInfos: fileInfos })
}

function uploadFilesApi(files) {
	const data = new FormData()
	files.forEach(f => data.append(f.name, f))

	return fetch(uploadUrl, { body: data, method: 'post' })
		.then(res => {
			if (json.status >= 400) {
				const err = Error(res.statusText)
				err.response = res
				throw err
			}
			return res.json()
		})
		.then(res => res.json())
}

export function* addFiles() {
	while (true) {
		const { files } = yield take(TYPES.FILE_UPLOAD_ADD_FILES)
		const task = yield fork(filesTask, files)
	}
}

export function* uploadFiles() {
	while (true) {
		const { files } = yield take(TYPES.FILE_UPLOAD_UPLOAD)
		try {
			yield uploadFilesApi(files)
			yield delay(5000)
			yield put({ type: TYPES.FILE_UPLOAD_SUCCESS })
		} catch (ex) {
			yield put({ type: TYPES.FILE_UPLOAD_FAILED, result: ex })
		}
	}
}
