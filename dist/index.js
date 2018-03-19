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
					currentReducer = initReducerStateAs(currentReducer);
				}
				return currentReducer(prevReducer(state, action), action);
			};
		}, function (state) {
			return state;
		})(state);
	};
};

var initReducerStateAs = exports.initReducerStateAs = function initReducerStateAs(initizer) {
	return function (state) {
		return state || initizer;
	};
};

var reducerForType = exports.reducerForType = function reducerForType(type, reducer) {
	return function (state, action) {
		if (action.type === type) {
			return reducer(state, action);
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
