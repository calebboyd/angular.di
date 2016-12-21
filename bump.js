var spawn = require('child_process').spawn
var versions = process.argv.slice(2)
var npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function command (arg) {
  const args = arg.split(' ')
  return new Promise((resolve, reject) => {
    spawn(args.shift(), args, { stdio: 'inherit' })
    .on('close', (code) => {
      code && reject(code)
      resolve()
    })
  })
}

function run (a, ...b) {
  return a.reduce((commands, c, i) => {
    commands.push(c, b[i])
    return commands
  }, [])
  .join('').trim().split('\n')
  .reduce((acc, c) => {
    return acc.then(() => command(c.trim()))
  }, Promise.resolve())
}

function bump (i) {
  i = i || 0
  if (i === versions.length) {
    return Promise.resolve(0)
  }
  const v = versions[i]
  return run`
    ${npm} install @angular/core@${v} --save-dev --save-exact
    ${npm} test
    ${npm} version ${v} --force --no-git-tag-version
    git commit -am v${v}
    git tag v${v}`.then(() => bump(++i))
}

const exit = process.exit.bind(process)
bump().then(exit, exit)