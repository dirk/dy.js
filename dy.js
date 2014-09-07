(function (window) {

  var dy = function (name, dependencies, initializer) {
    var self = dy.retrieveOrCreate(name)
    // Ensure all the dependencies exist
    dependencies = dependencies.map(function (dep) {
      return dy.retrieveOrCreate(dep)
    })
    initializer.apply(self, dependencies)
  }
  // Registry of all active modules
  dy.modules = {}

  dy.retrieveOrCreate = function (name) {
    if (dy.modules[name] === undefined) {
      // Set up new instance
      dy.modules[name] = {}
    }
    // Retrieve the instance of the module
    return dy.modules[name]
  }

  // Trigger _load() hook on all loaded modules
  dy.load = function () {
    for (var name in dy.modules) {
      if (dy.modules.hasOwnProperty(name) && dy.modules[name]._load !== undefined) {
        dy.modules[name]._load()
      }
    }
  }

  if (window) {
    window.dy = dy;
  }
})(window);
