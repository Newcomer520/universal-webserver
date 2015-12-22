import reducer from './src/reducers/reducer.js'
import chai,{expect} from 'chai'
import deepFreeze from 'deep-freeze'


const demoTest = (state = {id:0}, action) => {
		switch(action.type){
			case 'INC_ID':
				return {
					...state,
					id: id++
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

	expect( demoTest(stateBefore, action) ).to.deep.equal( stateAfter)

}
