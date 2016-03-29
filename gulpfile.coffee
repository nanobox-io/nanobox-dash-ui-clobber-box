autoprefixer = require 'gulp-autoprefixer'
bower        = require 'gulp-bower'
bump         = require 'gulp-bump'
cleanCSS     = require 'gulp-clean-css'
concat       = require 'gulp-concat'
connect      = require 'connect'
coffeeify    = require 'gulp-coffeeify'
foreach      = require 'gulp-foreach'
fs           = require 'fs'
git          = require 'gulp-git'
gulp         = require 'gulp'
gutil        = require 'gulp-util'
htmlMin      = require 'gulp-htmlmin'
http         = require 'http'
jade         = require 'gulp-jade'
livereload   = require 'gulp-livereload'
open         = require "gulp-open"
plumber      = require 'gulp-plumber'
rev          = require 'gulp-rev'  # Not currently using..
rimraf       = require 'rimraf'
sass         = require 'gulp-sass'
serveStatic  = require 'serve-static'
serveIndex   = require 'serve-index'
shadowIcons  = require 'gulp-shadow-icons'
uglify       = require 'gulp-uglify'
usemin       = require 'gulp-usemin'
watch        = require 'gulp-watch'
wrap         = require 'gulp-wrap'


# Paths to source files

jadeStagePath     = 'stage/index.jade'
jadePath          = 'app/jade/**/*.jade'
cssPath           = 'app/scss/**/*.scss'
cssStagePath      = 'stage/stage.scss'
appJsPath         = ['app/coffee/**/*.coffee', './server/js/jade/**/*.js']
stageJsPath       = 'stage/**/*.coffee'
assetPath         = ['app/assets/*.!(svg)', 'libs/core-styles/**/*.png']
svgPath           = 'app/assets/compiled/*.svg'
mainJsFile        = './app/coffee/main.coffee'
mainStageJsFile   = './stage/stage.coffee'

# ------------------------------------ Source compiling

htmlStage = (cb)->
  gulp.src jadeStagePath
    .pipe jade()
    .pipe plumber()
    .pipe gulp.dest('./server/')
    .on('end', cb)

html = (cb)->
  gulp.src( jadePath )
    .pipe jade(client: true)
    .pipe plumber()
    .pipe wrap( "module.exports = <%= file.contents %>" )
    .pipe gulp.dest('./server/js/jade')
    .on('end', cb)

css = (cb)->
  gulp.src( cssPath )
    .pipe sass().on('error', sass.logError)
    .pipe autoprefixer( browsers: ['last 1 version'],cascade: false )
    .pipe gulp.dest('./server/css')
    .on('end', cb)

cssStage = (cb)->
  gulp.src( cssStagePath )
    .pipe sass().on('error', sass.logError)
    .pipe autoprefixer( browsers: ['last 1 version'],cascade: false )
    .pipe gulp.dest('./server/stage/css')
    .on('end', cb)

js = (cb)->
  # App
  gulp.src( mainJsFile )
    .pipe plumber()
    .pipe coffeeify({options: { debug: true, paths: ["#{__dirname}/node_modules", "#{__dirname}/app/coffee/", "#{__dirname}/server/js/" ] } })
    .pipe gulp.dest('server/js/')
    .on('end', cb)

jsStage = (cb)->
  gulp.src mainStageJsFile
    .pipe plumber()
    .pipe coffeeify({options: { debug: true, paths: ["#{__dirname}/node_modules", "#{__dirname}/app/coffee/"] } })
    .pipe gulp.dest('server/stage/js')
    .on('end', cb)

parseSVG = (cb)->
  gulp.src svgPath
    .pipe shadowIcons {
      cssDest:'./css/'
      jsDest:'./js/'
      cssNamespace:''
      cssRegex:[]
    }
    .pipe gulp.dest('./server/')
    .on('end', cb)

# Compile
compileFiles = (doWatch=false, cb) ->
  count       = 0
  onComplete = ()=> if ++count == ar.length then cb()
  ar         = [
    {meth:js,         glob:appJsPath}
    {meth:css,        glob:cssPath}
    {meth:html,       glob:jadePath}
    {meth:parseSVG,   glob:svgPath}
    {meth:jsStage,    glob:stageJsPath}
    {meth:cssStage,   glob:cssStagePath}
    {meth:htmlStage,  glob:jadeStagePath}
    {meth:copyAssets, glob:assetPath, params:['server/assets', onComplete]}
  ]

  createWatcher = (item, params)->
    watch item.glob, =>
      item.meth.apply null, params
      .pipe( livereload() )
    item.meth.apply null, params

  # Watch / compile all the files found in the array
  for item in ar
    params = if item.params? then item.params else [onComplete]
    if doWatch
      createWatcher(item, params)
    else
      item.meth.apply null, params

# ------------------------------------ Random helpers

copyAssets = (destination, cb) ->
  gulp.src assetPath
    .pipe gulp.dest(destination)
    .on('end', cb)

copyBowerLibs = ()->
  bower().pipe gulp.dest('./server/bower-libs/')

copyFilesToBuild = ->
  gulp.src( './server/js/*' ).pipe gulp.dest('./rel/')
  gulp.src( './server/css/main.css' ).pipe gulp.dest('./rel/')

pushViaGit = ->
  # Start out by reading the version number for commit msg, then git push, etc..
  fs.readFile './bower.json', 'utf8', (err, data) =>
    regex   = /version"\s*:\s*"(.+)"/
    version = data.match(regex)[1]
    gulp.src('./')
      .pipe git.add()
      .pipe git.commit("BUILD - #{version}")
      .pipe git.push 'origin', 'master', (err)=> console.log( err)

bumpBowerVersion = ->
  gulp.src('./bower.json')
    .pipe bump( {type:'patch'} )
    .pipe(gulp.dest('./'));

minifyAndJoin = () ->
  gulp.src('./server/*.html').pipe foreach((stream, file) ->
    stream.pipe(
      usemin
        css : [ cleanCSS( {compatibility: 'ie8'} ) , 'concat']
        html: [ htmlMin( {collapseWhitespace: true})]
        js  : [ uglify() ]
    ).pipe gulp.dest('rel/')
  )


# ------------------------------------ Server

server = ->
  port      = 9622
  hostname  = null # allow to connect from anywhere
  base      = 'server'
  directory = 'server'

  app = connect()
    .use( serveStatic(base) )
    .use( serveIndex(directory) )

  http.createServer(app).listen port, hostname
  livereload.listen()
  console.log "SERVER LISTENING -> localhost:#{port}"

# Open in the browser
launch = -> gulp.src("").pipe open( uri: "http://localhost:9622/index.html" )


# ----------- MAIN ----------- #

gulp.task 'clean',                  (cb) -> rimraf './server', cb
gulp.task 'bowerLibs', ['clean'],   ()   -> copyBowerLibs()
gulp.task 'compile', ['bowerLibs'], (cb) -> compileFiles(true, cb)
gulp.task 'server', ['compile'],    (cb) -> server(); launch();
gulp.task 'default', ['server']

# ----------- BUILD (rel) ----------- #

gulp.task 'rel:clean',                                 (cb)  -> rimraf './rel', cb
gulp.task 'bumpVersion',                               ()    -> bumpBowerVersion()
gulp.task 'copyStatics', ['bowerLibs'],                ()    -> copyAssets('rel/assets', ->)
gulp.task 'releaseCompile', ['copyStatics'],           (cb)  -> compileFiles(false, cb)
gulp.task 'minify',['releaseCompile'],                 ()    -> minifyAndJoin();
gulp.task 'rel', ['rel:clean', 'bumpVersion', 'minify'],     -> rimraf './rel/index.html', ->
