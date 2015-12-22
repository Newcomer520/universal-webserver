import demoTest from '../src/reducers/testTargetReducer.js'
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
// MOCHA framework script start from here

describe('Array', () => {
	describe('demo add id', () => {
		it('should return 1 when the id is 1', () => {
			testAddId()
		})
	})
})
