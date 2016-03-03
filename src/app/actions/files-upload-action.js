export const TYPES = {
	FILE_UPLOAD_ADD_FILES: '/*FILE_UPLOAD_ADD_FILES*/',
	FILE_UPLOAD_REMOVE_FILE: '/*FILE_UPLOAD_REMOVE_FILE*/',
	FILE_UPLOAD_UPLOAD: '/*FILE_UPLOAD_UPLOAD*/',
	FILE_UPLOAD_UNION_FILES_BY_MD5: '/*FILE_UPLOAD_UNION_FILES_BY_MD5*/',
	FILE_UPLOAD_REQUESTING: '/*FILE_UPLOAD_REQUESTING*/',
	FILE_UPLOAD_SUCCESS: '/*FILE_UPLOAD_SUCCESS*/',
	FILE_UPLOAD_FAILED: '/*FILE_UPLOAD_FAILED*/'
}


export function addFiles(files) {
	return {
		type: TYPES.FILE_UPLOAD_ADD_FILES,
		files: files
	}
}

export function uploadFiles(files) {
	return {
		type: TYPES.FILE_UPLOAD_UPLOAD,
		files: files
	}
}

export function removeFile(key) {
	return {
		type: TYPES.FILE_UPLOAD_REMOVE_FILE,
		key: key
	}
}
