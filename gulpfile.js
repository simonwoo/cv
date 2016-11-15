'use strict';

var gulp = require('gulp');


var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var del = require('del');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('default', ['serve']);

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['wiredep', 'sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/styles/*.scss", ['sass']);
    gulp.watch("app/index.html").on('change', reload);
});

gulp.task('clean', del.bind(null, ['docs']));

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src("app/styles/*.scss")
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest("app/styles"))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('wiredep', function() {
    gulp.src('app/index.html')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('styles', ['sass'], function() {
    return gulp.src('app/styles/*.css')
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
        }))
        .pipe(gulp.dest('app/styles'));
});

gulp.task('html', ['styles'], function() {
    return gulp.src('app/*.html')
        .pipe($.useref())
        //挑出其中的js文件
        .pipe($.if('*.js', $.uglify()))
        /* 挑选出其中的css文件 */
        .pipe($.if('*.css', $.minifyCss()))
        .pipe($.useref())
        .pipe($.if('*.html', $.htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('docs'));
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('docs/images'));
});

gulp.task('pdf', function() {
    return gulp.src('app/pdf/**/*')
        .pipe(gulp.dest('docs/pdf'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('docs/fonts'));
});

gulp.task('build', ['clean', 'html', 'images', 'pdf', 'fonts'], function() {
    return gulp.src('docs/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});
