var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpSync = require('gulp-sync')(gulp),
    fileinclude = require('gulp-file-include'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    path = require('path');


var source = {
    scripts: {
        vendor: require('./vendor.json'),
        app: [
            "./modules/app/app.js",
            "./modules/app/app-controller.js",
            "./modules/**/!(app)*.js"
        ]
    },
    styles: [
        "./less/style.less",
        "./less/libs.less",
        "./less/components/**/*.less"
    ],
    templates: [
        "./modules/**/!(index)*.html"
    ],
    i18n: [
        "./i18n/*.js"
    ],
    assets: {
        images: [
        //    "./img/**/*.png"
        ],
        fonts: [
            "./node_modules/font-awesome/fonts/*",
            "./node_modules/bootstrap/fonts/*",
            "./node_modules/npm-font-source-sans-pro/fonts/**/*"
        ],
        select2: [
        //    "./bower_components/select2/select2.png",
        //    "./bower_components/select2/select2-spinner.gif"
        ],
        ico: [
            './assets/favicon.ico'
        ]
    }
};

var target = {
    scripts: '../public/js/',
    styles: '../public/css/',
    templates: '../public/views/',
    images: '../public/img/',
    fonts: '../public/fonts/',
    i18n: '../public/i18n/',
    public: '../public/',
    select2: '../public/css/',
    ico: '../public/'
};

gulp.task('default', gulpSync.sync(['assets:images', 'assets:fonts', 'styles', 'scripts:vendor', 'scripts:app', 'assets:select2', 'assets:ico', 'templates', 'templates:index', 'watch']));

gulp.task('scripts:vendor', function () {
    var stream = gulp.src(source.scripts.vendor)
        .pipe(concat('vendor.js'))
        .on('error', handleError);
    if (process.env.NODE_ENV == 'production') {
        stream.pipe(uglify())
            .on('error', handleError);
    }
    stream.pipe(gulp.dest(target.scripts));
    return stream;
});

gulp.task('scripts:app', function () {
    var stream = gulp.src(source.scripts.app)
        .pipe(concat('app.js'))
        .on('error', handleError);
    if (process.env.NODE_ENV == 'production') {
        stream.pipe(uglify())
            .on('error', handleError);
    }
    stream.pipe(gulp.dest(target.scripts));
    return stream;

});

gulp.task('styles', function () {
    return gulp.src(source.styles[0])
        .pipe(less())
        .on('error', handleError)
        .pipe(gulp.dest(target.styles))
});

gulp.task('templates:index', function () {
    return gulp.src("./modules/app/_index.html")
        .pipe(rename('index.html'))
        .on('error', handleError)
        .pipe(gulp.dest(target.public));
});

gulp.task('templates', function () {
    return gulp.src(source.templates)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'modules'
        }))
        .on('error', handleError)
        .pipe(htmlmin({
            removeComments: true,
           // collapseWhitespace: true
        }))
        .on('error', handleError)
        .pipe(gulp.dest(target.templates));
});

gulp.task('assets:images', function () {
    return gulp.src(source.assets.images)
        .pipe(gulp.dest(target.images));
});

gulp.task('assets:fonts', function () {
    return gulp.src(source.assets.fonts)
        .pipe(gulp.dest(target.fonts));
});

gulp.task('assets:select2', function () {
    return gulp.src(source.assets.select2)
        .pipe(gulp.dest(target.select2));
});

gulp.task('assets:ico', function () {
    return gulp.src(source.assets.ico)
        .pipe(gulp.dest(target.ico));
});


gulp.task('watch', function () {
    gulp.watch(source.scripts.app, ['scripts:app']);
    gulp.watch("./theme/js/app.js", ['scripts:vendor']);
    gulp.watch(source.styles, ['styles']);
    gulp.watch(source.templates, ['templates']);
    gulp.watch("./modules/app/_index.html", ['templates:index']);
});


function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
