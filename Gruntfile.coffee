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
        src: ['node_modules/noflo/src/lib/*.js']
        options:
          output: 'api/'
          template: '_docco/docco.jst'
          css: ''
      tutorials:
        src: [
          './projects/canadianness/graphs/*.fbp'
          './projects/canadianness/components/*.js'
          './projects/canadianness/index.js'
        ]
        options:
          output: '_includes/tutorials/canadianness'
          template: '_docco/tutorials.jst'
          css: ''

    watch:
      noflo:
        files: [
          '_docco/docco.jst'
        ]
        tasks: ['docco:noflo']
      tutorial:
        files: [
          '_docco/tutorials.jst'
          './projects/canadianness/components/*.coffee'
        ]
        tasks: ['docco:tutorials', 'jekyll']
      jekyll:
        files: [
          '_config.yml'
          'index.html'
          '**/*.html'
          '**/*.md'
          '**/*.js'
          'css/*.css'
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

    copy:
      package:
        files: [
          src: ['node_modules/noflo/package.json']
          dest: '_data/noflo.json'
        ]

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
    'watch'
  ]
  @registerTask 'build', [
    'sass:src'
    'copy:package'
    'docco'
    'jekyll'
  ]
  @registerTask 'test', [
    'build'
  ]
  @registerTask 'default', ['dev']
