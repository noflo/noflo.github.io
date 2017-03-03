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
      src:
        options:
          sourcemap: true
          style: 'compressed'
          bundleExec: true
        files:
          'css/main.css': 'css/main.scss'
      site:
        options:
          sourcemap: true
          style: 'compressed'
          bundleExec: true
        files:
          '_site/css/main.css': '_site/css/main.scss'
    
    copy:
      site2src:
        files: [
          expand: true
          cwd: '_site/css/'
          src: ['main.*'],
          dest: 'css/'
        ]
    
    #imagemin:
    #  dist:
    #    options:
    #      optimizationLevel: 7        
    #    files: [
    #        expand: true # only compressing jpg right now
    #        cwd: 'img-src/'
    #        src: ['**/*.jpg']
    #        dest: 'img/',
    #        ext: '.jpg'
    #    ]

    jekyll:
      dev:
        options:
          bundleExec: true

    docco:
      noflo:
        src: ['node_modules/noflo/src/lib/*.coffee']
        options:
          output: 'api/'
          template: '_docco/docco.jst'
          css: ''

    watch:
      noflo:
        files: [
          '_docco/*.jst'
        ]
        tasks: ['docco']
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
          '!_site/*'
          '!_src/*'
          '!_site/**/*'
          '!_src/**/*'
          '!node_modules/**'
          '!.git/**'
        ]
        tasks: ['jekyll']
      sass:
        files: [
          'css/*.scss'
        ]
        tasks: ['sass:src']

      siteSass:
        files: [
          '_site/css/*.scss'
        ]
        tasks: ['sass:site', 'copy:site2src']

  @loadNpmTasks 'grunt-jekyll'
  @loadNpmTasks 'grunt-docco'
  @loadNpmTasks 'grunt-contrib-connect'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-sass'
  @loadNpmTasks 'grunt-contrib-copy'
  #@loadNpmTasks 'grunt-contrib-imagemin'

  #@registerTask 'img', [
  #  'copy:img'
  #  'imagemin:dist'
  #]
  @registerTask 'chrome', [
    'connect:dev'
    'build'
    'sass:site'
    'watch:siteSass'
  ]
  @registerTask 'dev', [
    'connect:dev'
    'build'
    #'watch'
    'watch:jekyll'
    'watch:noflo'
    'watch:sass'
  ]
  @registerTask 'build', [
    'sass:src'
    'docco'
    'jekyll'
  ]
  @registerTask 'test', [
    'build'
  ]
  @registerTask 'default', ['dev']
