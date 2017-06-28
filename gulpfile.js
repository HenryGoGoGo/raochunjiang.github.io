(function(r) {
    'use strict';
    var
        gulp = r('gulp'),
        bom = r('gulp-bom'), //https://www.npmjs.com/package/gulp-bom; // 输出文件 utf-8 修复
        sass = r('gulp-sass'), //https://www.npmjs.com/package/gulp-sass; // scss/sass 编译支持
        cssmin = r('gulp-cssmin'), //https://www.npmjs.com/package/gulp-cssmin; // css 压缩
        htmlmin = r('gulp-htmlmin'), //https://www.npmjs.com/package/gulp-htmlmin; // html 压缩
        imagemin = require('gulp-imagemin'), //https://www.npmjs.com/package/gulp-imagemin // 图片压缩
        concat = r('gulp-concat'), //https://www.npmjs.com/package/gulp-htmlmin; // 合并 js/css 
        rename = r('gulp-rename'), //https://www.npmjs.com/package/gulp-rename; // 输出文件重命名
        reversion = r('gulp-rev'), //https://www.npmjs.com/package/gulp-rev; // 输出文件名追加 hash 版本
        usemin = r('gulp-usemin'), //https://www.npmjs.com/package/gulp-usemin;// html 资源引用优化
        autoprefixer = r('gulp-autoprefixer'), // https://www.npmjs.com/package/gulp-autoprefixer
        through = r('through2'),
        path = r('path'),
        fs = r('fs'),
        del = r('del'),
        sha = r('sha'),
        q = r('q');
    /**
     * path configuration
     */
    const srcDir = './src/';
    const buildDir = './src/';
    const releaseDir = './';
    const componentDir = './bower_components/';

    /**
     * 以源目录中的文件为基准验证目标目录中的文件是否已经发生变更。
     * @param {*源目录中的文件信息} file 
     * @param {*文件源目录} srcDir 
     * @param {*文件目标目录} targetDir 
     */
    function isFileDifferent(file, srcDir, targetDir) {
        var name = file.path;
        var targetName = name.replace(path.resolve(srcDir), path.resolve(targetDir));
        if (!fs.existsSync(targetName)) {
            return true;
        } else {
            var actural = sha.getSync(name);
            var expected = sha.getSync(targetName);

            if (actural !== expected) {
                return true;
            }
        }
        return false;
    }

    /**
     * build tasks
     */

    gulp.task('copy:bootstrapfonts', function() {
        return gulp.src(componentDir + 'bootstrap-sass/assets/fonts/**/*.*')
            .pipe(through.obj(function(file, enc, cb) {
                if (isFileDifferent(file, componentDir + 'bootstrap-sass/assets/fonts/bootstrap', buildDir + 'fonts/bootstrap')) {
                    this.push(file);
                }
                cb();
            }))
            .pipe(gulp.dest(buildDir + 'fonts/'));
    })
    gulp.task('build:bootstrap', ['copy:bootstrapfonts'], function() {
        return gulp.src(srcDir + 'scss/bootstrap.scss')
            .pipe(sass({
                includePaths: [componentDir + 'bootstrap-sass/assets/stylesheets/']
            }).on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('copy:font-awesome-fonts', function() {
        return gulp.src(componentDir + 'font-awesome/fonts/**/*.*')
            .pipe(through.obj(function(file, enc, cb) {
                if (isFileDifferent(file, componentDir + 'font-awesome/fonts', buildDir + 'fonts/font-awesome')) {
                    this.push(file);
                }
                cb();
            }))
            .pipe(gulp.dest(buildDir + 'fonts/font-awesome/'));
    });
    gulp.task('build:font-awesome', ['copy:font-awesome-fonts'], function() {
        return gulp.src(srcDir + 'scss/font-awesome.scss')
            .pipe(sass({
                includePaths: [componentDir + 'font-awesome/']
            }).on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('copy:simple-line-icons-fonts', function() {
        return gulp.src(componentDir + 'simple-line-icons/fonts/**/*.*')
            .pipe(through.obj(function(file, enc, cb) {
                if (isFileDifferent(file, componentDir + 'simple-line-icons/fonts', buildDir + 'fonts/simple-line-icons')) {
                    this.push(file);
                }
                cb();
            }))
            .pipe(gulp.dest(buildDir + 'fonts/simple-line-icons/'));
    });
    gulp.task('build:simple-line-icons', ['copy:simple-line-icons-fonts'], function() {
        return gulp.src(srcDir + 'scss/simple-line-icons.scss')
            .pipe(sass({
                includePaths: [componentDir + 'simple-line-icons/']
            }).on('error', sass.logError))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('build:sitecss', function() {
        return gulp.src(srcDir + 'scss/site.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(bom())
            .pipe(gulp.dest(buildDir + 'styles/'));
    });

    gulp.task('build', ['build:bootstrap', 'build:font-awesome', 'build:simple-line-icons', 'build:sitecss']);

    /**
     * release tasks
     */

    gulp.task('release:fonts', ['build'], function() {
        return gulp.src(buildDir + 'fonts/**/*.*')
            .pipe(through.obj(function(file, enc, cb) {
                if (isFileDifferent(file, buildDir + 'fonts', releaseDir + 'fonts')) {
                    this.push(file);
                }
                cb();
            }))
            .pipe(gulp.dest(releaseDir + 'fonts/'));
    });

    gulp.task('release:images', ['build'], function() {
        return gulp.src(buildDir + 'images/**/*.*')
            .pipe(imagemin())
            .pipe(through.obj(function(file, enc, cb) {
                if (isFileDifferent(file, buildDir + 'images', releaseDir + 'images')) {
                    this.push(file);
                }
                cb();
            }))
            .pipe(gulp.dest(releaseDir + 'images'));
    });

    gulp.task('release:index', ['build'], function() {
        return gulp.src(buildDir + 'index.html')
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(usemin({
                css: [cssmin, reversion]
            }))
            .pipe(bom())
            .pipe(gulp.dest(releaseDir))
    })

    gulp.task('release', ['release:index', 'release:fonts', 'release:images']);

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
    gulp.task('watch', function() {
        var watcher = gulp.watch('src/**/*.scss', ['release']);
        watcher.on('change', function(event) {
            console.log('Event type: ' + event.type); // added, changed, or deleted
            console.log('Event path: ' + event.path); // The path of the modified file
        });
    });


})(require);