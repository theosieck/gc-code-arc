const initialState = {
	respId: null,
	response: null,
	respTitle: null,
	codeLabels: null
};

export default function contextReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case 'SET_CONTEXT':
			return {
				respId: payload.respId,
				response: payload.response,
				respTitle: payload.respTitle,
				codeLabels: payload.codeLabels
			};
		case 'UPDATE_CONTEXT':
			return {
				...state,
				respId: payload.respId,
				response: payload.response,
				respTitle: payload.respTitle
			};
		default:
			return state;
	}
}
