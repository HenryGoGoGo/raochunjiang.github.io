(function(r) {
    'use strict';
    // 常用插件
    // var gulp = require('gulp');
    // var del = require('del');
    // var rev = require('gulp-rev');
    // var nano = require('gulp-cssnano');
    // var uglify = require('gulp-uglify')
    // var useref = require('gulp-useref');
    // var imagemin = require('gulp-imagemin');
    // var revCollector = require('gulp-rev-collector');
    // var browserSync = require('browser-sync').create();
    // var gulpSequence = require('gulp-sequence');
    // var uncss = require('gulp-uncss');
    // var htmlmin = require('gulp-htmlmin');
    // var base64 = require('gulp-base64');
    // var changed = require('gulp-changed');
    // var postcss = require("gulp-postcss");
    // var sprites = require('postcss-sprites').default;
    // var autoprefixer = require('autoprefixer');
    // var cssgrace = require('cssgrace');

    var
        gulp = r('gulp'),
        bom = r('gulp-bom'), //https://www.npmjs.com/package/gulp-bom; // 输出文件 utf-8 修复
        sass = r('gulp-sass'), //https://www.npmjs.com/package/gulp-sass; // scss/sass 编译支持
        cssmin = r('gulp-cssmin'), //https://www.npmjs.com/package/gulp-cssmin; // css 压缩
        htmlmin = r('gulp-htmlmin'), //https://www.npmjs.com/package/gulp-htmlmin; // html 压缩
        concat = r('gulp-concat'), //https://www.npmjs.com/package/gulp-htmlmin; // 合并 js/css 
        rename = r('gulp-rename'), //https://www.npmjs.com/package/gulp-rename; // 输出文件重命名
        reversion = r('gulp-rev'), //https://www.npmjs.com/package/gulp-rev; // 输出文件名追加 hash 版本
        usemin = r('gulp-usemin'), //https://www.npmjs.com/package/gulp-usemin;// html 资源引用优化
        del = r('del');
    /**
     * path configuration
     */
    const srcDir = './src/';
    const buildDir = './src/';
    const releaseDir = './';
    const componentDir = './bower_components/';

    /**
     * build tasks
     */

    gulp.task('copy:bootstrapfonts', function() {
        return gulp.src(componentDir + 'bootstrap-sass/assets/fonts/**/*.*')
            .pipe(gulp.dest(buildDir + 'fonts/'))
    })
    gulp.task('build:bootstrap', ['copy:bootstrapfonts'], function() {
        return gulp.src(srcDir + 'scss/bootstrap.scss')
            .pipe(sass({
                includePaths: [componentDir + 'bootstrap-sass/assets/stylesheets/']
            }).on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('build:sitecss', function() {
        return gulp.src(srcDir + 'scss/site.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('build', ['build:bootstrap', 'build:sitecss']);

    /**
     * release tasks
     */

    gulp.task('release:fonts', ['build'], function() {
        return gulp.src(buildDir + 'fonts/**/**.*')
            .pipe(gulp.dest(releaseDir));
    })

    gulp.task('release:index', ['build'], function() {
        return gulp.src(buildDir + 'index.html')
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(usemin({
                css: [cssmin, reversion]
            }))
            .pipe(bom())
            .pipe(gulp.dest(releaseDir))
    })

    gulp.task('release', ['release:index', 'release:fonts']);

    gulp.task('default', ['build']);

    /**
     * clean task
     */
    gulp.task('clean', function() {
        return del([
            buildDir + 'fonts/',
            buildDir + 'styles/',
            releaseDir + 'index.html',
            releaseDir + 'fonts/',
            releaseDir + 'styles/'
        ]);
    });
    /**
     * 实时监听
     */
    // gulp.task('sass:watch', function() {
    //     gulp.watch('./sass/**/*.scss', ['sass']);
    // });

})(require)