const Request = require('request');
const fs = require('fs');
const beautify = require('js-beautify').js_beautify;
const crypto = require('crypto');
let filePrefix = 'agario.core.';

function main() {
    downloadLatestCore()
        .then((code)=> {
            return beautify(code);
        })

        .then((code)=> {
            // console.log(code);
            return code;
        })
        .then(saveCore)
        .catch((err)=> {
            console.log('Error : ', err)
        });
}


function downloadLatestCore() {
    return new Promise(function (resolve, reject) {
        Request.get('http://agar.io/agario.core.js', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
}

function saveCore(code) {
    return new Promise(function (resolve, reject) {
        let newFilename = filePrefix + (new Date()).toISOString().slice(0, 19).replace(/[-:]/g, ".").replace(/T/g, "-") + '.js';
        var content = fs.writeFile(newFilename, code, function (error) {
            if (error) {
                throw new Exception('Error while saving file' + newFilename + ':' + error);
            } else {
                console.log('File saved', newFilename);
                resolve(newFilename);
            }
        });
    });
}

function hashFromFile(fileName) {
    return new Promise(function (resolve, reject) {

        var fd = fs.createReadStream(fileName);
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');

        fd.on('end', function () {
            hash.end();
            console.log(hash.read()); // the desired sha1sum
            resolve(hash.read());
        });

        // read all file and pipe it (write it) to the hash object
        fd.pipe(hash);
    });

}

function hashFromString(str) {
    var hash = crypto.createHash('sha1');
    // change to 'binary' if you want a binary hash.
    hash.setEncoding('hex');
    // the text that you want to hash
    hash.write(str);
    // very important! You cannot read from the stream until you have called end()
    hash.end();
    // and now you get the resulting hash
    var sha1sum = hash.read();
    return sha1sum;
}

// from http://stackoverflow.com/a/24853826/1446677
function getNewestFile(dir, files) {
    return new Promise(function (resolve, reject) {
        if (!files || (files && files.length === 0)) {
            reject('no files');
        }
        var newest = {file: files[0]};
        var checked = 0;
        fs.stat(dir + newest.file, function (err, stats) {
            newest.mtime = stats.mtime;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                (function (file) {
                    fs.stat(file, function (err, stats) {
                        ++checked;
                        if (stats.mtime.getTime() > newest.mtime.getTime()) {
                            newest = {file: file, mtime: stats.mtime};
                        }
                        if (checked == files.length) {
                            resolve(newest);
                        }
                    });
                })(dir + file);
            }
        });
    });
}


main();