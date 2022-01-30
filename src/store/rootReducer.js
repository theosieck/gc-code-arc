// import { combineReducers } from "@reduxjs/toolkit";

const initialState = {
	respId: null,
	response: null,
	codeLabels: null,
};

export default function rootReducer(state = initialState, action) {
	const { type, payload } = action;
	console.log(type, payload);
	switch (type) {
		case "SET_STATE":
			console.log("in case");
			return {
				...state,
				respId: payload.respId,
				response: payload.response,
				codeLabels: payload.codeLabels,
			};
		default:
			return state;
	}
}
