## 原理

```js
(function (lists) {
	function require(file) {
		const exports = {};
		new Function("exports", lists[file])(exports);
		return exports;
	}

	const add = require("./src/a.js").default;
	console.log(add);
	const minus = require("./src/b.js").default;
	console.log(add(4, 3));
	console.log(minus(4, 3));
})({œ
	"./src/a.js": "exports.default = function add(a,b){return a + b}",
	"./src/b.js": "exports.default = function minus(a,b){return a - b}",
});
```


## node package
- @babel/parser    转换为ast
- @babel/traverse  分析import
- @babel/core      es6 转 es5