var Request = require('request');
var fs = require('fs');

var filePrefix = 'agario.core.';
var localFilename = filePrefix + (new Date()).toISOString().slice(0,19).replace(/[-:]/g,".").replace(/T/g,"-") + '.js';
console.log('Going to create file ', localFilename);
var file = fs.createWriteStream(localFilename);

var req = Request('http://agar.io/agario.core.js');
req.on('response', function (res) {
    var file = fs.createWriteStream(localFilename);
    // setup piping
    res.pipe(file);

    res.on('end', function () {
        // go on with processing
    });
});/**
 * Created by frl on 05/10/2016.
 */
