"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var chainReducer = exports.chainReducer = function chainReducer() {
	for (var _len = arguments.length, reducersList = Array(_len), _key = 0; _key < _len; _key++) {
		reducersList[_key] = arguments[_key];
	}

	return function (state, action) {
		return reducersList.reduceRight(function (prevReducer, currentReducer) {
			return function (state) {
				if (typeof currentReducer !== "function") {
					currentReducer = initStateAs(currentReducer);
				}
				return currentReducer(prevReducer(state, action), action);
			};
		}, function (state) {
			return state;
		})(state);
	};
};

var initStateAs = exports.initStateAs = function initStateAs(initizer) {
	return function (state) {
		return state || initizer;
	};
};

function testType(type, action) {
	if (type === "*") return true;
	if (typeof type === "string") return action.type === type;
	if (typeof type === "function") return type(action);
	if (Array.isArray(type)) return type.some(function (oneType) {
		return testType(oneType, action);
	});
}

var reducerForType = exports.reducerForType = function reducerForType(type, reducer) {
	return function (state, action) {
		if (testType(type, action)) {
			return reducer(state, action) || state; // when you forget to return default state under '*';
		}
		return state;
	};
};

var makeReducer = exports.makeReducer = function makeReducer(reducerMap) {
	return function (state, action) {
		if (reducerMap[action.type]) {
			return reducerMap[action.type](state, action);
		} else {
			return state;
		}
	};
};
