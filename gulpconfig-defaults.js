const gutil = require('gulp-util')
const assign = require('lodash.assign')
const pkg = require('./package.json')

const config = {
  version: pkg.version,
  source: './src',
  target: './dist',
  minify: false,
  debug: true,
  url: 'https://dev.kolibri.is',
}

const envs = {
  prod: {
    minify: true,
    debug: false,
    url: 'https://www.kolibri.is',
  },
}

// Extend with environment specific config
const env = gutil.env.env || (gutil.env.prod ? 'prod' : 'dev')
assign(config, envs[env])

// EXPORT
module.exports = (externalConfig) => {
  if (externalConfig) {
    assign(config, externalConfig)
  }

  // BUILD
  if (!config.build) {
    config.build = {
      tasks: ['scripts', 'styles', 'views', 'static'],
    }
  }

  // SERVER
  if (!config.server) {
    // eslint-disable-next-line global-require
    const historyApiFallback = require('connect-history-api-fallback')

    config.server = {
      port: 3000,
      server: {
        baseDir: config.target,
      },
      ui: {
        port: 3010,
      },
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false,
      },
      files: [
        config.target,
      ],
      logLevel: 'info',
      logFileChanges: true,
      logConnections: false,
      logPrefix: '-server-',
      notify: false,
      open: false,
      middleware: [historyApiFallback()],
    }
  }

  // SCRIPTS
  if (!config.scripts) {
    config.scripts = {
      watchTasks: ['scripts'],
      watchSource: [
        `${config.source}/scripts/**/*.js`,
        'node_modules/@kolibridev/components',
      ],
      source: [
        `${config.source}/scripts/**/*.js`,
      ],
      target: `${config.target}/scripts`,
      browserify: {
        entries: [`${config.source}/scripts/main.js`],
        debug: config.debug,
      },
      // all|license|function|some – https://github.com/terinjokes/gulp-uglify#options
      preserveComments: '',
    }
  }

  // STYLES
  if (!config.styles) {
    config.styles = {
      watchTasks: ['styles'],
      watchSource: [
        `${config.source}/styles/**/*.scss`,
        'node_modules/@kolibridev/styles',
      ],
      source: [
        `${config.source}/styles/**/*.scss`,
        `!${config.source}/styles/**/_*.scss`,
      ],
      target: `${config.target}/styles`,
      options: {
        includePaths: [
          `${config.source}/styles`,
          'node_modules/@kolibridev/styles/node_modules',
          'node_modules',
        ],
        outputStyle: config.minify ? 'compressed' : 'expanded',
      },
      autoprefixer: {
        browsers: [
          'ie >= 10',
          '> 1%',
          'last 2 versions',
          'Firefox ESR',
          'Opera 12.1',
        ],
        cascade: false,
      },
    }
  }

  // VIEWS
  config.views = Object.assign({
    watchTasks: ['views'],
    watchSource: [
      `${config.source}/views/**/*.{jade,pug,svg}`,
      `${config.source}/images/**/*.{svg}`,
    ],
    source: [
      `${config.source}/views/**/*.{jade,pug}`,
      `!${config.source}/views/**/_*.{jade,pug}`,
    ],
    target: config.target,
    options: {
      pretty: false,
      basedir: config.source,
      locals: {
        env: {
          version: config.version,
          env: config.env,
          url: config.url,
        },
        // inject content here
      },
    },
    content: false,
  }, config.views)

  // CONTENTFUL
  config.contentful = Object.assign({
    client: {
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    },
    srcset: [300, 768, 1024, 1200, 2048],
    favicons: [256, 195, 152, 144, 128, 120, 114, 96, 72, 57, 48, 32, 16],
    markdownContentTypes: [],
    markdownFields: [],
    imageFields: ['image'],
    datetimeFields: ['datetime', 'date', 'time'],
    splitTagFields: ['socialMediaHandles'],
    numberFields: ['price'],
  }, config.contentful)

  // STATIC
  if (!config.static) {
    config.static = {
      assets: {},
    }
  }
  config.static.assets = Object.assign({
    root: {
      tasks: ['static'],
      source: `${config.source}/*.{html,txt,ico}`,
      target: config.target,
    },
    images: {
      tasks: ['static'],
      source: [
        `${config.source}/images/**/*.{png,gif,jpg,jpeg,ico,svg}`,
        `${config.source}/views/**/*.svg`,
      ],
      target: `${config.target}/images`,
    },
    fonts: {
      tasks: ['static'],
      source: `${config.source}/fonts/**/*`,
      target: `${config.target}/fonts`,
    },
  }, config.static.assets)

  // WATCH
  if (!config.watch) {
    config.watch = [
      'static',
      'styles',
      'scripts',
      'views',
    ]
  }

  return config
}
