const gulp = require('gulp')
const _ = require('underscore')
const merge = require('merge-stream')

module.exports = (config) => {
  gulp.task('static', () => {
    const stream = merge()

    _.each(config.static.assets, (source) => {
      stream.add(
        gulp.src(source.source)
          .pipe(gulp.dest(source.target))
      )
    })

    return stream.isEmpty() ? null : stream
  })
}
