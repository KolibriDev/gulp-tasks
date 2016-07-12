const gulp = require('gulp')
const path = require('path')
const glob = require('glob')
const defaults = require('./gulpconfig-defaults.js')

module.exports = (cfg) => {
  const config = defaults(cfg)

  const tasks = glob.sync(path.resolve(__dirname, './tasks/**/*.js'))
  tasks.forEach((task) => {
    // eslint-disable-next-line global-require
    const comp = require(task)
    if (typeof(comp) === 'function') {
      comp(config)
    }
  })
  gulp.foobar = config
  return gulp
}
