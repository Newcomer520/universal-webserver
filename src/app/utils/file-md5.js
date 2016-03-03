import SparkMD5 from 'spark-md5'

/**
 * get the md5 hash of the specified file
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
export default function(file) {
	const promise = new Promise((resolve, reject) => {
		let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        	chunkSize = 2097152,                             // Read in chunks of 2MB
        	chunks = Math.ceil(file.size / chunkSize),
	        currentChunk = 0,
	        spark = new SparkMD5.ArrayBuffer(),
	        fileReader = new FileReader()

    fileReader.onload = function (e) {
      // console.log('read chunk nr', currentChunk + 1, 'of', chunks)
      spark.append(e.target.result)                   // Append array buffer
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        // console.log('finished loading');
        const md5 = spark.end()
        console.info('computed hash', md5)  // Compute hash
        resolve({ md5: md5 })
      }
    }

    fileReader.onerror = function () {
      console.warn('oops, something went wrong.')
      reject('something went wrong while calculating md5 of the file ', file.name)
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
	})

	return promise
}
