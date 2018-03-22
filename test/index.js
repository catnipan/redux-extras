const expect = require('chai').expect;
const {chainReducer, initStateAs, reducerForType, makeReducer} = require('../dist');

describe('chainReducer', function () {
	function reducerAdd(state, action){
		if(action.type === "ADD"){
			return { num: state.num + action.num };
		}
		return state;
	}
	function reducerMultiply(state, action){
		if(action.type === "MULTIPLY"){
			return { num: state.num * action.num };
		}
		return state;
	}
	function reducerMultiplyWithInitialState(state = { num: 5 }, action){
		if(action.type === "MULTIPLY"){
			return { num: state.num * action.num };
		}
		return state;
	}
	function routineTest(reducer){
		expect(reducer).to.be.a("function");
		expect(reducer({ num: 5 }, { type: "ADD", num: 10 })).to.deep.equal({ num: 15});
		expect(reducer({ num: 5 }, { type: "MULTIPLY", num: 10 })).to.deep.equal({ num: 50});
	}
	it('should work with normal reducers', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiplyWithInitialState);
		routineTest(reducer);
	});
	it('should work with nomral reducers and initStateAs', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiply, initStateAs({num: 5}));
		routineTest(reducer);
	});
	it('should work with nomral reducers and impilict initial state', () => {
		const reducer = chainReducer(reducerAdd, reducerMultiply, {num: 5});
		routineTest(reducer);
	});
});

describe('reducerForType', function () {
	it('should only work for the target string type', function () {
		const reducer = reducerForType("ADD", (state, action) => ({
			num: state.num + action.num
		}));
		expect(reducer).to.be.a("function");
		expect(reducer({ num : 5 }, { type: "ADD", num: 10 })).to.deep.equal({ num: 15 });
		expect(reducer({ num : 5 }, { type: "MULTIPLY", num: 5 })).to.deep.equal({ num : 5 });
	});
	it('should only work for the target function type', function () {
		const reducer = reducerForType(action => (action.num > 0 && action.type === "ADD"), (state, action) => ({
			num: state.num + action.num
		}));
		expect(reducer).to.be.a("function");
		expect(reducer({ num : 5 }, { type: "ADD", num: 10 })).to.deep.equal({ num : 15 });
		expect(reducer({ num : 5 }, { type: "ADD", num: -10 })).to.deep.equal({ num : 5 });
	});
	it('should work for any type when using wildcard "*"', function () {
		const reducer = reducerForType("*", (state, action) => {
			if(action.type === "ADD") return { num: state.num + action.num };
			if(action.type === "MULTIPLY") return { num: state.num * action.num };
		})
		expect(reducer).to.be.a("function");
		expect(reducer({ num : 5 }, { type: "ADD", num: 10 })).to.deep.equal({ num : 15 });
		expect(reducer({ num : 5 }, { type: "MULTIPLY", num: 10 })).to.deep.equal({ num : 50 });
		expect(reducer({ num : 5 }, { type: "DIVIDE", num: 5 })).to.deep.equal({ num : 5 });
	});
	it('should work for array type', function( ){
		const reducer = reducerForType([action => action.num < -10, action => action.num > 10], (state, action) => ({
			num: state.num + action.num
		}));
		expect(reducer({ num : 5 }, { type: "ADD", num: -5 })).to.deep.equal({ num : 5 });
		expect(reducer({ num : 5 }, { type: "ADD", num: 20 })).to.deep.equal({ num : 25 });
		expect(reducer({ num : 5 }, { type: "ADD", num: -105 })).to.deep.equal({ num : -100 });
	})
});

describe('makeReducer', function () {
	function routineTest(reducer){
		expect(reducer).to.be.a("function");
		expect(reducer({ num: 5 }, { type: "ADD", num: 10 })).to.deep.equal({ num: 15 });
		expect(reducer({ num: 5 }, { type: "MULTIPLY", num: 5 })).to.deep.equal({ num : 25 });
	}
	it('should work just like the normal reducers', function(){
		const reducer = makeReducer({
			"ADD": (state = {num:5}, action) => ({ num: state.num + action.num }),
			"MULTIPLY": (state = {num:5}, action) => ({ num: state.num * action.num })
		});
		routineTest(reducer);
	});
	it('should work with chain reducer and initStateAs', function(){
		const reducer = chainReducer(makeReducer({
			"ADD": (state, action) => ({ num: state.num + action.num }),
			"MULTIPLY": (state, action) => ({ num: state.num * action.num })
		}), { num: 5 })
		routineTest(reducer);
	})
})