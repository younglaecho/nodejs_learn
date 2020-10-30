var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

let templateHTML = (title, list, body, control) => {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
let templatelist = (filelist) => {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list
}

let fileWrite = (request,response) => {
  var body ='';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.decode(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
      response.writeHead(302, {Location:`/?id=${title}`});
      response.end('Success'); 
    })
  });
}

let fileChange = (request,response) => {
  var body ='';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.decode(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`./data/${id}`,`./data/${title}`,()=>{
      fs.writeFile('./data/'+ title, description,'utf8',function(err){
        response.writeHead(302, {Location: `/?id=${title}`}); 
        response.end('Success');
      });  
    });
  });
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {

      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templatelist(filelist);
        var template = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      })
    } else {
      fs.readdir('./data', function (error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list = templatelist(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`,
            ` <a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" placeholder="title" value=${title}>
                <input type="submit" value="delete">
              </form>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === '/create' ){
    fs.readdir('./data', function (error, filelist) {
      var title = 'WEB - create';
      var description = 'Hello, Node.js';
      var list = templatelist(filelist);
      var template = templateHTML(title, list,``, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="desciption"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `);
      response.writeHead(200);
      response.end(template);
    });
  } else if(pathname === '/create_process') {
    fileWrite(request,response);
  } else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = templatelist(filelist);
        var template = templateHTML(title, list, 
          `
          <h2>${title}</h2>
          <form action="/update_process" method="post">
          <input type="hidden" name="id" placeholder="title" value=${title}>
            <p><input name="title" placeholder="title" value=${title}></p>
            <p>
              <textarea name="description" placeholder="desciption">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a> <a href="/delete"></a>`);
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === '/update_process') {
    fileChange(request,response)
  } else if (pathname === '/delete_process') {
    var body ='';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.decode(body);
      var title = post.id;
      fs.unlink(`data/${title}`, (err) => {
        response.writeHead(302, {Location:`/`});
        response.end('Success'); 
      })
    });
  } else{
    response.writeHead(404);
    response.end('Not found');
  }



});
app.listen(3000);