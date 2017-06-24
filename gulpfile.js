(function(r) {
    'use strict';

    var gulp = r('gulp');
    var bom = r('gulp-bom');
    var sass = r('gulp-sass');
    var htmlmin = r('gulp-htmlmin');

    const srcDir = './src/';
    const buildDir = './src/';
    const releaseDir = './';
    /**
     * build
     */

    gulp.task('sass:build', function() {
        return gulp.src(srcDir + 'scss/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('build', ['sass:build']);

    /**
     * release
     */

    gulp.task('sass:release', function() {
        return gulp.src(srcDir + 'scss/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(releaseDir + 'styles/'));
    });

    gulp.task('html:release', function() {
        return gulp.src(srcDir + 'index.html')
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(bom())
            .pipe(gulp.dest(releaseDir))
    })

    // 发布
    gulp.task('release', ['sass:release', 'html:release']);

    gulp.task('default', ['build']);

    /**
     * 实时监听
     */
    gulp.task('sass:watch', function() {
        gulp.watch('./sass/**/*.scss', ['sass']);
    });

})(require)