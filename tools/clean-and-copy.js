import run from './run.js'
async function copyStaticFilesOnly() {
	await run(require('./clean'))
	await run(require('./copy'))
}

export default copyStaticFilesOnly
