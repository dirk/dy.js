
var Primus = require('primus'),
    _      = require('lodash'),
    fs     = require('fs')

var Reloadable = function (name, opts) {
  // Setup defaults
  _.assign(this, {
    // Path to the local file to watch
    'watch': null,
    // Remote path to reload in the browser
    'reload': null
  })
  // Overwrite with opts
  _.assign(this, opts)
  this.name = name
}
Reloadable.prototype.setupWithParent = function (reloader) {
  var reloadable = this
  this.reloader = reloader
  // Only watch a file if we have a file to watch
  if (this.watch === null || this.watch === undefined) {
    return
  }
  // Poll every 500 milliseconds
  var watcher = fs.watchFile(this.watch, {
    persistent: true,
    interval: 500
  }, function (curr, prev) {
    console.log('Change to '+reloadable.name)
    reloadable.reloader.onReloadableChanged(reloadable)
  })
  watcher.on('error', function (err) {
    console.log('Error watching '+reloadable.name+': '+err.toString())
  })
}

var Reloader = function (app, server) {
  var reloader = this
  this.primus = new Primus(server, {
    pathname: '/.dy/primus',
    parser: 'JSON'
  })
  this.reloadables = []
  app.get('/.dy/browser.js', function (req, res) {
    res.header('Content-Type', 'application/javascript')
    var browser = fs.readFileSync(__dirname+'/browser.js')
    res.end(reloader.primus.library()+"\n"+browser)
  })
  app.get('/.dy/reloadables.json', function (req, res) {
    var json = reloader.getReloadablesForJS()
    res.end(JSON.stringify({reloadables: json}))
  })
}
Reloader.prototype.getReloadablesForJS = function () {
  var ret = this.reloadables.map(function (r) {
    var obj = _.clone(r)
    // Prevent circular references
    delete obj.reloader
    return obj
  })
  return ret
}
Reloader.prototype.addReloadable = function (reloadable) {
  this.reloadables.push(reloadable)
  reloadable.setupWithParent(this)
}
Reloader.prototype.onReloadableChanged = function (reloadable) {
  this.primus.write({event: 'changed', name: reloadable.name})
}

module.exports = {Reloader: Reloader, Reloadable: Reloadable}
