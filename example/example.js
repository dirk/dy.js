
dy('example1', ['example2'], function (example2) {
  var example1 = this
  this._load = function () {
    console.log('example1._load')
  }
  this._unload = function () {
    console.log('example1._unload')
  }
})

dy('example2', ['example1'], function (example1) {
  var example2 = this
  this._load = function () {
    console.log('example2._load')
  }
})
