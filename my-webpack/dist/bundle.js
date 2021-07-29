(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                // console.log(code)
                // (new Function('exports','require', code))()
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('./src/a.js');
        // console.log(add(3,4))
    })({"./src/a.js":{"deps":{"./b.js":"./src/b.js"},"code":"\"use strict\";\n\nvar _b = _interopRequireDefault(require(\"./b.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _b[\"default\"])(2, 3));"},"./src/b.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _default = function _default(a, b) {\n  return a + b;\n};\n\nexports[\"default\"] = _default;"}})