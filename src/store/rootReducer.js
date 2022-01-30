import { combineReducers } from "@reduxjs/toolkit";
import contextReducer from "./contextReducer";
import reviewReducer from "./reviewReducer";

const rootReducer = combineReducers({
	context: contextReducer,
	reviews: reviewReducer
});

export default rootReducer;