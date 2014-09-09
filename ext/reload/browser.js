
(function (window) {
  var Reloader = function (dy) {
    this.dy = dy
  }

  var getReloadables = function (reloader) {
    var req      = new XMLHttpRequest(),
        async    = false
    req.onload = function () {
      var data = this.responseText
      reloader.reloadables = JSON.parse(data).reloadables
    }
    req.open('GET', '/.dy/reloadables.json', async)
    req.send()
  }

  Reloader.prototype.setup = function () {
    var reloader = this
    getReloadables(this)
    this.primus = Primus.connect()
    this.primus.on('data', this.getMessageHandler())
  }

  Reloader.prototype.onModuleChanged = function (name) {
    var module = this.dy.modules[name]
    var spec   = this.reloadables.filter(function (r) {
      return r.name === name
    })[0]
    if (spec === null) {
      console.log('Unable to find module to reload named: '+name)
      return
    }
    // First trigger the unload
    if (typeof module._unload === 'function') {
      module._unload()
    }
    // Then load the new version through the DOM
    var script = document.createElement('script')
    script.type = 'text/javascript'
    var url = spec.reload,
        now = (new Date()).getTime()
    if (url.indexOf('?') === -1) {
      url += '?'+now
    } else {
      url += '&'+now
    }
    script.src = url
    script.onload = function () {
      // Then trigger the load
      if (typeof module._load === 'function') {
        module._load()
      }
    }
    console.log('Reloading '+name)
    // Finally add it to the DOM
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(script)
  }

  Reloader.prototype.onData = function (data) {
    if (data.event === 'changed') {
      this.onModuleChanged(data.name)
    }
  }
  Reloader.prototype.getMessageHandler = function () {
    var reloader = this
    return function message(data) {
      reloader.onData.call(reloader, data)
    }
  }

  if (window) {
    window.dy.Reloader = Reloader
  }
})(window);
