const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      pug           = require('gulp-pug'),
      autoprefixer  = require('gulp-autoprefixer'),
      concat        = require('gulp-concat'),
      rename        = require('gulp-rename'),
      del           = require('del'),
      imagemin      = require('gulp-imagemin'),
      spritesmith   = require('gulp.spritesmith');

// gulp.task('html', function(){
//   return gulp.src('src/index.html')
//     .pipe(gulp.dest('build'));
// });

gulp.task('pug', function(){
  return gulp.src('src/index.pug')
          .pipe(pug({pretty: true}))
          .pipe(gulp.dest('build'));
});

gulp.task('sass', function(){
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/styles'));
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

gulp.task('sprite', function(cb){
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

gulp.task('watch', function(){
  gulp.watch('src/index.pug', gulp.series('pug'));
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('dev', gulp.series(
  'clean:build',
  gulp.parallel('pug', 'sass', 'imagemin', 'copy:companies', 'sprite'),
  'watch'
  )
);