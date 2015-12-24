

const demoTest = (state = { id: 0}, action) => {
	switch (action.type) {
	case 'INC_ID':
		return {
			...state,
			id: state.id + 1
		}
	default:
		return state;
	}
}



export default demoTest
