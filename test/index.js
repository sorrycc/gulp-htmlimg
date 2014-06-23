var htmlimg = require('../');
var gulp = require('gulp');
var through = require('through2');

describe('htmlimg', function() {

  it('normal', function(done) {
    gulp
      .src('./test/fixtures/a.html')
      .pipe(htmlimg(webp))
      .pipe(through.obj(function(file) {
        file.contents.toString().should.be.eql('<img src="abc.webp.jpg" />\n');
        done();
      }));
  });
});

function webp(imgs, cb) {
  setTimeout(function() {
    cb(null, imgs.map(function(img) {
      return img.replace(/\.(jpg|png|gif|jpeg)$/, '.webp.$1');
    }));
  }, 100);
}

