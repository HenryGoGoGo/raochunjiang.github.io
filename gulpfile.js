(function (r) {
    'use strict';

    var gulp = r('gulp');
    var sass = r('gulp-sass');

    gulp.task('sass:build', function () {
        return gulp.src('styles/scss/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('styles/css'));
    });


    // 生成
    gulp.task('build', ['sass:build'], function () {

    });
    // 发布
    gulp.task('release', []);

    gulp.task('default', ['build']);

    /**
     * 实时监听
     */
    gulp.task('sass:watch', function () {
        gulp.watch('./sass/**/*.scss', ['sass']);
    });

})(require)