const Promise = require('bluebird'),
  { map, coroutine } = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  { join, normalize, relative } = require('path'),
  match = normalize('src/di'),
  root = normalize('node_modules/@angular/core/src')
  type = join(root, 'type.d.ts')


fs.mkdirSync(normalize('./dist'))
fs.mkdirSync(normalize('./dist/di'))

function getName (x) {
  if(x === join('dist','di.d.ts')) {
    return join('dist', 'bundle.d.ts')
  }
  return x
}

!function readDir(dirName) {
  return fs.readdirAsync(dirName).map((fileName) => {
    var path = join(dirName, fileName)
    return fs.statAsync(path).then((stat) =>
      stat.isDirectory() ? readDir(path) : path
    )
  }).reduce((a, b) => a.concat(b), [])
}(root)
.filter(x => {
  return x.endsWith('d.ts') && ~x.indexOf(match) || x === type
})
.map(x => relative(root, x))
.each(coroutine(function* (x) {
  return fs.writeFileAsync(
    getName(join('dist', x)),
    yield fs.readFileAsync(join(root, x))
  )
})).catch(x => console.error(x))
