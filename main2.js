var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
            var index = queryData.id === undefined;
            var title = index ? 'Welcome' : queryData.id;
            var description = index ? 'Hello,Nodejs' : description;
            fs.readdir('./data/', (err, filelist) => {
                var list = '<ul>';
                for (let i = 0; i < filelist.length; i++) {
                    list = list + `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
                }
                list = list + '</ul>';
                var template = `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    ${description}
                </body>
                </html> 
                `;
                response.writeHead(200);
                response.end(template);
            });

        })
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);