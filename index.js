var through = require('through2');
var uniq = require('uniq');
var gutil = require('gulp-util');
var $ = require('cheerio');
var format = require('util').format;
var dirname = require('path').dirname;
var join = require('path').join;
var exists = require('fs').existsSync;

module.exports = function(fn) {

  return through.obj(function(file, enc, callback) {
    var contents = file.contents.toString();
    var images = getImages(contents);
    images = images.filter(function(image) {
      return exists(join(dirname(file.path), image));
    });

    fn(images, function(e, urls) {
      if (e) {
        return callback(new gutil.PluginError('cssimg', e));
      }

      var newContent = replaceContent(images, urls, contents);
      file.contents = new Buffer(newContent);
      callback(null, file);
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
