var gm = require('gm');
var jpeg = require('jpeg-js');
var external = module.exports;
var UInt64 = require('cuint').UINT64;

external.hash = function(image, cb) {
  gm(image)
    .noProfile()
    .colorspace('GRAY')
    .resize(8, 8, '!')
    .toBuffer(function(error, buffer) {
      if (error) return cb(error);
      buffer = jpeg.decode(buffer).data;
      var bytes = [];
      var averageValue = 0;
      for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
          var start = y * 8 + x * 4;
          var r = buffer[start];
          var g = buffer[start + 1];
          var b = buffer[start + 2];
          var a = buffer[start + 3];
          //console.log('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
          var value = r + g + b; // * 1000000;
          value /= 12;
          value = parseInt(value);
          bytes.push(value);
          averageValue += value;
        }
      }

      averageValue /= 64;
      averageValue = parseInt(averageValue);

      var hash = UInt64(0);
      for (var i = 0; i < 64; i++) {
        if (bytes[i] >= averageValue) {
          hash.or(UInt64(1).shiftLeft(63 - i));
          //hash |= (1 << (63 - i));
        }
      }

      cb(null, hash.toString(16));
    });
};
