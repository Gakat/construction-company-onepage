const gulp          = require('gulp'),
      browserSync   = require('browser-sync'),
      sass          = require('gulp-sass'),
      pug           = require('gulp-pug'),
      cleanCSS      = require('gulp-clean-css'),
      autoprefixer  = require('gulp-autoprefixer'),
      concat        = require('gulp-concat'),
      rename        = require('gulp-rename'),
      del           = require('del'),
      imagemin      = require('gulp-imagemin'),
      spritesmith   = require('gulp.spritesmith');

gulp.task('server', function(){
  browserSync.init({
    server: {
        port: 3111,
        baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('templates:compile', function(){
  return gulp.src('src/templates/index.pug')
          .pipe(pug({pretty: true}))
          .pipe(gulp.dest('build'));
});

gulp.task('styles:compile', function(){
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('js:compile', function(){
  return gulp.src('src/js/main.js')
          .pipe(gulp.dest('build/js'));
});

gulp.task('imagemin', function(){
  return gulp.src('src/images/*.*')
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]
    // , {verbose: true}
    ))
    .pipe(gulp.dest('build/images'));
});

gulp.task('sprites:compile', function(cb){
  const spriteData = gulp.src('src/images/icons/*.png')
                      .pipe(spritesmith({
                        imgName: 'icons.png',
                        imgPath: '../images/icons.png',
                        cssName: 'icons.scss'
                      }));
  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('src/sass/global/'));
  cb();                  
});

gulp.task('clean:build', function(){
  return del(['build/*']);
});

gulp.task('copy:companies', function(){
  return gulp.src('src/images/companies/*.*')
          .pipe(gulp.dest('build/images/companies/'));
});

gulp.task('copy:normalize', function(){
  return gulp.src('node_modules/normalize.css/normalize.css')
          .pipe(cleanCSS())
          .pipe(rename('normalize.min.css'))
          .pipe(gulp.dest('build/styles'));
});

gulp.task('watch', function(){
  gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/sass/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('src/js/**/*.js', gulp.series('js:compile'));
});

gulp.task('dev', gulp.series(
  'clean:build',
  gulp.parallel('templates:compile', 'styles:compile', 'js:compile', 'imagemin', 'copy:companies', 'copy:normalize', 'sprites:compile'),
  gulp.parallel('watch', 'server')
  )
);