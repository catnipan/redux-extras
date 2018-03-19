export const chainReducer = (...reducersList) => (state, action) => {
	return reducersList.reduceRight((prevReducer, currentReducer) => state => {
		if(typeof currentReducer !== "function"){
			currentReducer = initStateAs(currentReducer);
		}
		return currentReducer(prevReducer(state, action), action)
	}, state => state)(state);
}

export const initStateAs = initizer => state => {
	return state || initizer;
}

export const reducerForType = (type, reducer) => (state, action) => {
	if(action.type === type){
		return reducer(state, action);
	}
	return state;
}

export const makeReducer = reducerMap => (state, action) => {
	if(reducerMap[action.type]){
		return reducerMap[action.type](state, action);
	} else {
		return state;
	}
}