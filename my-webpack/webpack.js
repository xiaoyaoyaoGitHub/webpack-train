const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const { join } = require('path')
// 解析文件
const getModuleInfo = function (filePath) {
    const content = fs.readFileSync(join(__dirname, filePath), 'utf-8');
    const asts = parser.parse(content, { //转化为抽象语法数
        sourceType: 'module'
    })
    // 收集依赖
    const deps = {};
    traverse(asts, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filePath);
            const absImportPath = './' + path.join(dirname, node.source.value);
            // {
            //   './b.js': '/Users/wangly/Documents/study/WEBPACK/my-webpack/src/b.js'
            // }
            console.log(absImportPath);
            deps[node.source.value] = absImportPath
        }
    })

    // es6 转 es5
    const { code } = babel.transformFromAst(asts, null, {
        presets: ['@babel/preset-env']
    })
    const moduleInfo = {
        code,
        filePath,
        deps
    }

    return moduleInfo
}
// 解析依赖
function parseModule(filePath) {
    const entry = getModuleInfo(filePath);
    // console.log(entry);
    const temp = [entry];

    getDeps(temp, entry);

    const depGraph = {};
    temp.forEach(module => {
        depGraph[module.filePath] = {
            deps: module.deps,
            code: module.code
        }
    })
    console.log(depGraph);
    return depGraph
}
// 递归依赖
function getDeps(temp, entry) {
    const { deps = {} } = entry;
    Object.keys(deps).forEach(item => {
        const child = getModuleInfo(deps[item]);
        temp.push(child);
        getDeps(temp, child)
    })
}

function bundle(filePath) {
    const moduleContents = JSON.stringify(parseModule(filePath));

    return `(function (graph) {
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
        require('${filePath}');
        // console.log(add(3,4))
    })(${moduleContents})`
}

!fs.existsSync('./dist') && fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', bundle('./src/a.js'))