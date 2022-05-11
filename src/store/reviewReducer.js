const initialState = {
	clicked: null,
	handleMatches: null,
	handleSingles: null,
	completedCases: []
};

export default function reviewReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'SET_REVIEW':
			return {
				...state,
				...payload
			};
		case 'COMPLETE_CASE':
			const completedCases = state.completedCases;
			completedCases.push(payload);
			return {
				...state,
				completedCases
			};
		default:
			return state;
	}
}
