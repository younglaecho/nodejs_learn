var fs = require('fs');

//readFileSync

// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// console.log(result);


//readFile

console.log('a');
fs.readFile('syntax/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('c');
