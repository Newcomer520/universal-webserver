import demoTest from 'reducers/demo-testing-reducer.js'
import { expect } from 'chai'
import deepFreeze from 'deep-freeze'


const testAddId = () => {
	const action = {
		type: 'INC_ID'
	}
	const stateBefore = {
		id: 0
	}
	const stateAfter = {
		id: 1
	}

	deepFreeze(stateBefore)

	expect(demoTest(stateBefore, action)).to.deep.equal(stateAfter)
}


const testDefaultState = () => {
	const action = {
		type: 'INC_ID'
	}
	const stateBefore = {
		id: 0
	}
	const stateAfter = {
		id: 1
	}

	deepFreeze(stateBefore)

	expect(demoTest(undefined, action)).to.deep.equal(stateAfter)
}

const testOtherAction = () => {
	const action = {
		type: 'DEC_ID'
	}
	const stateBefore = {
		id: 0
	}
	const stateAfter = {
		id: 1
	}

	deepFreeze(stateBefore)

	expect(demoTest(stateBefore, action)).to.deep.equal(stateBefore)
}
// MOCHA framework script start from here

describe('Array', () => {
	describe('demo add id', () => {
		it('should return id: 1 when the id: 0', () => {
			testAddId()
		})
		it('should return id: 1 when not provide id', () => {
			testDefaultState()
		})
		it('should return id: 0 when action not known', () => {
			testOtherAction()
		})

	})
})
