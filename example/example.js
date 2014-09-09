
dy('example1', ['example2'], function (example2) {
  var example1 = this

  this._load = function () {
    console.log('example1._load')
    // This will be executed every time the module is loaded
    var el = document.getElementById('main')
    el.innerText = 'Hello from example at '+(new Date()).getTime()
  }
  this._unload = function () {
    console.log('example1._unload')
    // This will be called when the module is unloaded
    var el = document.getElementById('main')
    el.innerText = 'example: Unloaded'
  }
})

dy('example2', ['example1'], function (example1) {
  var example2 = this
  this._load = function () {
    console.log('example2._load')
  }
})
