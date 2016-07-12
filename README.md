# Gulp tasks

Collection of useful gulp tasks. WIP!

## Usage

```bash
npm install @kolibridev/gulp-tasks
```

### Example
#### Config
See [gulpconfig-defaults](./gulpconfig-defaults.js) for all default options. Usually something like this will suffice.
```javascript
// ./gulp/config.js
const path = require('path')
const gutil = require('gulp-util')
const assign = require('lodash.assign')
const pkg = require('../package.json')

const config = {
  version: pkg.version,
  source: path.resolve(__dirname, '../src'),
  target: path.resolve(__dirname, '../dist'),
  minify: false,
  debug: true,
  url: 'https://dev.domain.com',
}

const envs = {
  prod: {
    minify: true,
    debug: false,
    url: 'https://www.domain.com',
  },
}

// Extend with environment specific config
const env = gutil.env.env || (gutil.env.prod ? 'prod' : 'dev')
assign(config, envs[env])

module.exports = config
```
#### Gulpfile
This can be directly in `./gulpfile.js` or create something like `./gulp/index.js` and require it in `./gulpfile.js`
```javascript
// ./gulpfile.js
require('./gulp')
```
This package exposes a function that optionally takes in your config. This example will register all the tasks for you. You can theoretically just register the tasks you're actually going to use. **NOTE:** If you create a local task (within your own project) with the same name as one of these, it will overwrite it's function.
```javascript
// ./gulp/index.js
const gulp = require('gulp')
const gutil = require('gulp-util')
const _ = require('lodash')
const config = require('./config')

_.forOwn(require('@kolibridev/gulp-tasks')(config).tasks, (task) => {
  gutil.log(gutil.colors.green(`Registered ${gutil.colors.blue(task.name)} task`))
  gulp.task(task.name, task.dep, task.fn)
})
```
