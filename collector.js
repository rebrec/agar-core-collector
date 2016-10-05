const Request = require('request');
const fs = require('fs');
const beautify = require('js-beautify').js_beautify;

let  filePrefix = 'agario.core.';

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


// from http://stackoverflow.com/a/24853826/1446677
function getNewestFile(dir, files, callback) {
    if (!callback) return;
    if (!files || (files && files.length === 0)) {
        callback();
    }
    if (files.length === 1) {
        callback(files[0]);
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
                        callback(newest);
                    }
                });
            })(dir + file);
        }
    });
}