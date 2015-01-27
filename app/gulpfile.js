var gulp = require('gulp'),
    yargs = require('yargs').argv,
    gulpif = require('gulp-if'),
    del = require('del'),
    concat = require('gulp-concat'),
    streamqueue = require('streamqueue'),
    es = require('event-stream'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    minifyCSS = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    ngHtml2JS = require('gulp-ng-html2js'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    preprocess = require('gulp-preprocess'),
    extend = require('node.extend'),
    path = require('path'),
    gulpfileLocal = 'gulpfile.local.js',
    options = {
        dist: 'dist',
        base: '/',
        env: {
            prod: !yargs.dev
        },
        version: new Date().getTime(),
        rename: {
            suffix: '.min'
        },
        streamqueue: {
            objectMode: true
        },
        jshint: '.jshintrc',
        jshintReporter: 'default',
        minifyHTML: {
            empty: true,
            spare: true,
            quotes: true
        },
        ngHtml2JS: {
            moduleName: 'templates'
        },
        uglify: {
            mangle: true
        },
        imagemin: {
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        },
        annotate: {
            remove: true,
            add: true,
            single_quotes: true
        }
    };

    if (path.existsSync(gulpfileLocal)) {
        options = extend(true, options, require('./'+gulpfileLocal));
    }

var css = {
        source: 'app/css/less/app.less',
        sourceDeps: 'app/css/less/**/*.less',
        cssSource: 'app/css/css/**/*.css',
        output: options.dist + '/css',
        filename: 'app.css'
    },
    fonts = {
        source: [
            'bower_components/bootstrap/fonts/*',
            'app/fonts/*'
        ],
        output: options.dist + '/fonts'
    },
    js = {
        source: {
            vendors: [
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.min.js',
                'bower_components/d3/d3.min.js',
                'bower_components/angular-charts/dist/angular-charts.min.js',
                'bower_components/angular-easyfb/angular-easyfb.min.js',
                'bower_components/bootstrap/dist/js/bootstrap.min.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-sanitize/angular-sanitize.min.js',
                'bower_components/angular-translate/angular-translate.min.js',
                'bower_components/angular-animate/angular-animate.min.js',
                'bower_components/ngDialog/js/ngDialog.js'
            ],
            modules: ['app/js/**/*.module.js'],
            app: ['app/js/**/*.js', '!app/js/**/*.module.js'],
            all: ['app/js/**/*.js']
        },
        output: options.dist + '/js',
        filename: 'app.js'
    },
    tpl = {
        source: 'app/js/**/*.html'
    },
    html = {
        source: ['app/*', 'app/.*'],
        output: options.dist
    },
    images = {
        source: 'app/img/**/*',
        output: options.dist + '/img'
    },
    config = {
        source: 'app/config/**/*',
        output: options.dist + '/config'
    },
    assets = {
        source: {
            dist: [
                'app/.htaccess',
                'app/favicon.ico',
                '!app/css/less{,/**}'
            ],
            js: [
                'bower_components/html5shiv/dist/html5shiv.min.js',
                'bower_components/respond/dest/respond.min.js'
            ]
        },
        output: {
            dist: options.dist,
            js: js.output
        }
    },
    cleanDir = [options.dist + '/**/*', options.dist + '/.htaccess', '!' + options.dist + '.gitkeep'];

// Clean
gulp.task('clean', function (cb) {
    del(cleanDir, cb);
});

// Build Less first time
gulp.task('less', function () {
    return gulp.src([css.source, css.cssSource])
        .pipe(less())
        .pipe(concat(css.filename))
        .pipe(gulpif(options.env.prod, rename(options.rename)))
        .pipe(gulpif(options.env.prod, minifyCSS()))
        .pipe(gulp.dest(css.output));
});

// Build Less Sources by watch (for dev)
gulp.task('lessSources', function () {
    return gulp.src(css.source)
        .pipe(less())
        .pipe(rename(css.filename))
        .pipe(gulp.dest(css.output));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src(fonts.source)
        .pipe(gulp.dest(fonts.output));
});

// Js
gulp.task('js', function () {
    return streamqueue(options.streamqueue,
            gulp.src(js.source.vendors),
            streamqueue(options.streamqueue,
                gulp.src(js.source.modules),
                gulp.src(js.source.app)
            )
                .pipe(ngAnnotate(options.annotate))
                .pipe(jshint(options.jshint))
                .pipe(jshint.reporter(options.jshintReporter)),
            gulp.src(tpl.source)
                .pipe(minifyHTML(options.minifyHTML))
                .pipe(ngHtml2JS(options.ngHtml2JS))
        )
        .pipe(concat(js.filename))
        .pipe(gulpif(options.env.prod, rename(options.rename)))
        .pipe(gulpif(options.env.prod, uglify(options.uglify)))
        .pipe(gulp.dest(js.output));
});

// Images
gulp.task('images', function () {
    return gulp.src(images.source)
        //.pipe(imagemin(options.imagemin)) uncomment this when images minifcation will be needful
        .pipe(gulp.dest(images.output));
});


// Configs
gulp.task('config', function () {
    return gulp.src(config.source)
        .pipe(gulp.dest(config.output));
});

// Assets
gulp.task('assets', function () {
    return es.merge(
        gulp.src(assets.source.dist)
            .pipe(gulp.dest(assets.output.dist)),
        gulp.src(assets.source.js)
            .pipe(gulp.dest(assets.output.js))
    );
});

// Html
gulp.task('html', function () {
    return gulp.src(html.source)
        .pipe(preprocess({
            context: {
                BASE: options.base,
                VERSION: options.version,
                PROD: options.env.prod
            }
        }))
        .pipe(gulp.dest(html.output));
});

// Browser sync
gulp.task('browser-sync', function() {
    browserSync.init(options.dist + '/**');
});

// Watch
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(css.sourceDeps, ['lessSources']);
    gulp.watch([js.source.all, tpl.source], ['js']);
    gulp.watch(images.source, ['images']);
    gulp.watch(html.source, ['html']);
    gulp.watch(assets.source.dist, ['assets']);
});

// Build
gulp.task('build', ['less', 'fonts', 'js', 'assets', 'config', 'images', 'html'], function () {
    if (!options.env.prod) {
        gulp.start('watch');
    }
});

// Default
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});