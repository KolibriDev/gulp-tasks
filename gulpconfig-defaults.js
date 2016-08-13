const _ = require('lodash')
const pkg = require('./package.json')

let config = {
  version: pkg.version,
  source: './src',
  target: './dist',
  minify: false,
  debug: true,
  preset: 'website',
}

const envs = {
  local: {
    env: 'local',
    url: 'http://localhost',
  },
  test: {
    env: 'test',
  },
  staging: {
    env: 'staging',
    minify: true,
    debug: false,
    url: 'https://dev.kolibri.is',
  },
  production: {
    minify: true,
    debug: false,
    url: 'https://www.kolibri.is',
  },
}

// Extend with environment specific config
let env = ''
if (process.env.CI && process.env.CI.toString() === 'true') {
  if (process.env.TRAVIS_BRANCH === 'master') {
    env = 'production'
  } else if (process.env.TRAVIS_BRANCH === 'develop') {
    env = 'staging'
  } else {
    env = 'test'
  }
} else {
  env = process.env.ENVIRONMENT || 'local'
}
_.assign(config, envs[env])

// EXPORT
module.exports = (externalConfig) => {
  if (externalConfig) {
    _.assign(config, externalConfig)
  }

  const presets = {
    email: {
      build: {
        tasks: ['styles', 'views', 'static'],
      },
      views: {
        watchSource: [
          `${config.source}/views/**/*.{jade,pug,svg}`,
          `${config.source}/images/**/*.{svg}`,
          `${config.source}/styles/**/*.css`,
          `${config.target}/styles/**/*.scss`,
        ],
        inlineCss: {
          applyStyleTags: false,
          removeStyleTags: false,
          applyLinkTags: true,
          removeLinkTags: true,
          url: `file://${config.target}/`,
        },
        task: 'email',
      },
    },
    website: {
      build: {
        tasks: ['scripts', 'styles', 'views', 'static'],
      },
    },
  }

  if (config.preset && presets.hasOwnProperty(config.preset)) {
    _.assign(config, presets[config.preset])
  }

  // BUILD
  config.build = Object.assign({
    tasks: ['scripts', 'styles', 'views', 'static'],
  }, config.build)

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
        'node_modules/@kolibridev/components/lib',
      ],
      source: [
        `${config.source}/scripts/**/*.js`,
      ],
      target: `${config.target}/scripts`,
      browserify: {
        entries: [`${config.source}/scripts/main.js`],
        debug: config.debug,
      },
      uglify: {
        // all|license|function|some – https://github.com/terinjokes/gulp-uglify#options
        preserveComments: '',
      },
    }
  }

  // STYLES
  if (!config.styles) {
    config.styles = {
      watchTasks: ['styles'],
      watchSource: [
        `${config.source}/styles/**/*.scss`,
        'node_modules/@kolibridev/styles/src',
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
      },
    },
    task: 'default',
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
    parse: (data) => data,
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
