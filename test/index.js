const expect = require('chai').expect;
const {chainReducer, initStateAs, reducerForType, makeReducer} = require('../dist');

describe('chainReducer', function () {
	const initialState = 5;
	function reducerAdd(state, action){
		if(action.type === "ADD"){
			return state + action.num;
		}
		return state;
	}
	function reducerMultiply(state, action){
		if(action.type === "MULTIPLY"){
			return state * action.num;
		}
		return state;
	}
	function reducerMultiplyWithInitialState(state = initialState, action){
		if(action.type === "MULTIPLY"){
			return state * action.num;
		}
		return state;
	}
	function routineTest(reducer){
		expect(reducer).to.be.a("function");
		expect(reducer(undefined, { type: "ADD", num: 10 })).to.equal(initialState + 10);
		expect(reducer(initialState + 10, { type: "MULTIPLY", num: 5 })).to.equal((initialState + 10) * 5);
	}
	it('should work with normal reducers', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiplyWithInitialState);
		routineTest(reducer);
	});
	it('should work with nomral reducers and initStateAs', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiply, initStateAs(initialState));
		routineTest(reducer);
	});
	it('should work with nomral reducers and impilict initial state', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiply, initialState);
		routineTest(reducer);
	});
});

describe('reducerForType', function () {
	const initialState = 5;
	const reducerAdd = reducerForType("ADD", (state = initialState, action) => {
		return state + action.num;
	});
	it('should only work with the target type', function () {
		expect(reducerAdd).to.be.a("function");
		expect(reducerAdd(undefined, { type: "ADD", num: 10 })).to.equal(initialState + 10);
		expect(reducerAdd(initialState + 10, { type: "MULTIPLY", num: 5 })).to.equal(initialState + 10);
	});
});

describe('makeReducer', function () {
	const initialState = 5;
	function routineTest(reducer){
		expect(reducer).to.be.a("function");
		expect(reducer(undefined, { type: "ADD", num: 10 })).to.equal(initialState + 10);
		expect(reducer(initialState + 10, { type: "MULTIPLY", num: 5 })).to.equal((initialState + 10) * 5);
	}
	it('should work just like the normal reducers', function(){
		const reducer = makeReducer({
			"ADD": (state = initialState, action) => state + action.num,
			"MULTIPLY": (state = initialState, action) => state * action.num
		});
		routineTest(reducer);
	});
	it('should work with chain reducer and initStateAs', function(){
		const reducer = chainReducer(makeReducer({
			"ADD": (state, action) => state + action.num,
			"MULTIPLY": (state, action) => state * action.num
		}), initialState)
		routineTest(reducer);
	})
})