// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    files: [
      "styles.scss",
      "../node_modules/bootstrap/scss/bootstrap.scss"
    ],
    preprocessors: {
      'src/**/*.scss': ['scss'],
      'styles.scss':['scss'],
      '../node_modules/bootstrap/scss/bootstrap.scss':['scss'],
      '../node_modules/font-awesome/scss/font-awesome.scss':['scss']
    },
    scssPreprocessor: {
      options: {
        sourceMap: true,
        includePaths: ['bower_components']
      }
    }
  });
};