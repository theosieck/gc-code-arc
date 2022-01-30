const initialState = {
	clicked: null,
	handleMatches: null,
	handleSingles: null
}

export default function reviewReducer (state = initialState, action) {
	const {type, payload} = action;
	switch (type) {
		case 'SET_REVIEW':
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}