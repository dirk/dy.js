
var express = require('express'),
    dy = require('../ext/reload/server'),
    fs = require('fs')

app = express()
app.get('/', function (req, res) {
  fs.createReadStream('./index.html').pipe(res)
})
app.get('/dy.js', function (req, res) {
  res.header('Content-Type', 'application/javascript')
  fs.createReadStream('../dy.js').pipe(res)
})
app.get('/example.js', function (req, res) {
  res.header('Content-Type', 'application/javascript')
  fs.createReadStream('./example.js').pipe(res)
})

var server = app.listen(3000, function () {
  var reloader = new dy.Reloader(app, server)
  reloader.addReloadable(new dy.Reloadable('example1', {
    watch: './example.js',
    reload: 'example.js'
  }))
  console.log('Listening on port %d', server.address().port)
})
