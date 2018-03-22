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

function testType(type, action){
	if(type === "*") return true;
	if(typeof type === "string") return (action.type === type);
	if(typeof type === "function") return type(action);
	if(Array.isArray(type)) return type.some(oneType => testType(oneType, action));
}

export const reducerForType = (type, reducer) => (state, action) => {
	if(testType(type, action)){
		return reducer(state, action) || state; // when you forget to return default state under '*';
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