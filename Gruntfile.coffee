module.exports = ->
  # Project configuration
  @initConfig
    pkg: @file.readJSON 'package.json'

    connect:
      dev:
        options:
          hostname: '*'
          port: 4000
          base: '_site'

    sass:
      dev:
        options:
          # sourcemap: true
          style: 'expanded'
        files:
          'css/main.css': 'css/main.scss'

    jekyll:
      dev:
        options: {}

    watch:
      jekyll:
        files: [
          '_config.yml'
          'index.html'
          '**/*.html'
          '**/*.md'
          '**/*.js'
          '**/*.css'
          '**/_posts/*.md'
          # Ignore the generated files
          '!_site/**'
        ]
        tasks: ['jekyll']
      sass:
        files: [
          'css/*.scss'
        ]
        tasks: ['sass']

  @loadNpmTasks 'grunt-jekyll'
  @loadNpmTasks 'grunt-contrib-connect'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-sass'

  @registerTask 'dev', [
    'connect:dev'
    'sass'
    'jekyll'
    'watch'
  ]
  @registerTask 'default', ['dev']
