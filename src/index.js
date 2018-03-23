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

function testType(typePattern, action){
	if(typePattern === "*") return true;
	if(typeof typePattern === "string") return (action.type === typePattern);
	if(typeof typePattern === "function") return typePattern(action);
	if(Array.isArray(typePattern)) return typePattern.some(oneType => testType(oneType, action));
}

export const reducerForType = (typePattern, reducer) => (state, action) => {
	if(testType(typePattern, action)){
		return reducer(state, action) || state; // when you forget to return default state under '*';
	}
	return state;
}

export const reducerWhenState = (statePattern, reducer) => (state, action) => {
	if(typeof statePattern !== "function"){
		throw new Error("state Pattern must be a function");
	}
	if(statePattern(state)){
		return reducer(state, action);
	}
	return state;
}

export const combineReducer = (reducerMap) => (state, action) => {
	for(let key in reducerMap){
		state[key] = reducerMap[key](state[key], action);
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