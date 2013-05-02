var static = require('node-static');
//var util = require('util');


var file = new(static.Server)('./app');
var port = process.env.PORT || 5000;
require('http').createServer(function (request, response) {
  file.serve(request, response, function(err, result) {
    if (err) {
      console.error('ERROR (%d): %s %s', response.statusCode, request.method, request.url, err.message);
    } else {
      console.log('%s %s - (%d)', request.method, request.url, response.statusCode);
    }
  });
  file.serve(request, response);
}).listen(port);
console.log('node-static running at http://localhost:%d', port);
