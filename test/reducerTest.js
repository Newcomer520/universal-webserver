//import reducer from './src/reducers/reducer.js'
import chai, { expect } from 'chai'
import deepFreeze from 'deep-freeze'


const demoTest = (state = { }, action) => {
		switch(action.type){
			case 'INC_ID':
				return {
					...state,
					id: state.id+1
				}
			default:
				return state;
		}
}

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

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      testAddId()
    });
  });
});
