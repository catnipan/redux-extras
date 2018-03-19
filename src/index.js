
export const chainReducers = (...reducersList) => (state, action) => {
	return reducersList.reduceRight((prevReducer, currentReducer) => state => {
		if(typeof currentReducer !== "function"){
			currentReducer = initReducerStateAs(currentReducer);
		}
		return currentReducer(prevReducer(state, action), action)
	}, state => state)(state);
}

export const initReducerStateAs = initizer => state => {
	return state || initizer;
}

export const reducerForType = (type, reducer) => (state, action) => {
	if(action.type === type){
		return reducer(state, action);
	}
	return state;
}

export const makeReducerFrom = reducerMap => (state, action) => {
	if(reducerMap[action.type]){
		return reducerMap[action.type](state, action);
	} else {
		return state;
	}
}
