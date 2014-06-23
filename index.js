var through = require('through2');
var uniq = require('uniq');
var gutil = require('gulp-util');
var $ = require('cheerio');
var format = require('util').format;

module.exports = function(fn) {

  return through.obj(function(file, enc, callback) {
    var that = this;

    var contents = file.contents.toString();
    var images = getImages(contents);
    fn(images, function(e, urls) {
      if (e) {
        return callback(new gutil.PluginError('cssimg', e));
      }

      var newContent = replaceContent(images, urls, contents);
      file.contents = new Buffer(newContent);
      that.push(file);
    });
  });
};

function getImages(content) {
  var images = [];
  $('img', content).each(function() {
    var src = $(this).attr('src');
    var isRelative = !/^https?:\/\//.test(src);
    if (isRelative) {
      images.push(src);
    }
  });
  return uniq(images);
}
 
function replaceContent(images, urls, content) {
  images.forEach(function(image, i) {
    var re = new RegExp('<img[^>]+?'+image+'.*?>', 'gi');
    var newImage = format('<img src="%s" />', urls[i]);
    content = content.replace(re, newImage);
  });
  return content;
}
