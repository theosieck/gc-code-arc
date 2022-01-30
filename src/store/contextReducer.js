const initialState = {
	respId: null,
	response: null,
	codeLabels: null
};

export default function contextReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'SET_CONTEXT':
			return {
				...state,
				respId: payload.respId,
				response: payload.response,
				codeLabels: payload.codeLabels
			};
		default:
			return state;
	}
}
