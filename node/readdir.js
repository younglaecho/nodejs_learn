var testFolder = './data/'
var fs = require('fs');

var result = fs.readdir(testFolder, (err, filelist) => {
    console.log(filelist);
})
