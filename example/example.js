
dy('example1', ['example2'], function (example2) {
  var example1 = this
  this._load = function () {
    console.log('there')
  }
})

dy('example2', ['example1'], function (example1) {
  var example2 = this
})
