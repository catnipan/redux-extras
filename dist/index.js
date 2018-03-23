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

function testType(typePattern, action) {
	if (typePattern === "*") return true;
	if (typeof typePattern === "string") return action.type === typePattern;
	if (typeof typePattern === "function") return typePattern(action);
	if (Array.isArray(typePattern)) return typePattern.some(function (oneType) {
		return testType(oneType, action);
	});
}

var reducerForType = exports.reducerForType = function reducerForType(typePattern, reducer) {
	return function (state, action) {
		if (testType(typePattern, action)) {
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
