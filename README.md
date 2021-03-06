Redux-Extras
=============

Utility functions for making [redux](http://redux.js.org) use easier.

```js
npm install --save redux-extras
```

## Usage
### `chainReducer(reducerA, reducerB, reducerC ...)`

accepts a list of reducer functions and generating a new reducer, which works like the state being applied to those reducers from right to left.

```js
chainReducer(reducerA, reducerB, reducerC)
```

is the same as 

```js
function (state, action){
	return reducerA(reducerB(reducerC(state, action), action), action)
}
```

### `initStateAs(initState)`

`initState` is the start state object. Used for initiation with chainReducer, make sure it be the last argument.

```js
chainReducer(reducerA, initStateAs(initState))
```

or you can put your initial state object directly,

```js
chainReducer(reducerA, initState)
```

this is the same as

```js
function reducerA(state = initState, action){
	...
}
```

### `reducerForType(typePattern, reducer)`

another approach to "if-else type ===" or "switch case default" operations. 

`typePattern` is interpreted as

- If `typePattern` is  `'*'` then it does not any filter type.
- If it is a function, then type is matched if `typePattern(action)` is true (e.g. `typePattern(action => action.num > 0, reducer)` will match all actions having positive `num` field.)
- If it is a String, the action is matched if `action.type === typePattern` (e.g. `take("INC", reducer)`
- If it is an array, each item in the array is matched with above rules, so the mixed array of strings and function predicates is supported. (e.g.`reducerForType(["INC", "DEC"], reducer)` and that would match either actions of type `"INC"` or `"DEC"`).


Combing with `chainReducer` helps you split your code logic into seperate files. If the action type doesn't match, it ignores it and move to the next reducer in the chain. 

```js
chainReducer(
	reducerForType("inc", (state, action) => state + action.num ),
	reducerForType("dec", (state, action) => state - action.num ),
	initState
)
```

works the same as

```js
function reducer(state = initState, action){
	switch(action.type){
		case "inc": 
			return state + action.num
		case "dec":
			return state - action.num
		default:
			return state
	}
}
```

### `makeReducer`

create a reducers from an object where key is an action type and value is relevant reducer function. the reducer above can also be written as

```js
chainReducer(
	makeReducer({
		"inc": (state, action) => state + action.num,
		"dec": (state, action) => state - action.num
	}),
	initState
)
```

## Thanks

The idea of type pattern comes from [redux-saga](https://redux-saga.js.org/docs/api/index.html#takepattern).

## License

MIT