
// This is the base browser library for dy.js. It is all that is needed in the
// browser for modules written for dy.js to work.
//
// In development you'd probably also want to include the dy/ext/reload
// extension to add dynamic reloading functionality. However, in production
// this is the *only* code you need (plus a `dy.load()` somewhere) for your
// dy.js-compatible code to work.
(function (window) {

  var dy = function (name, dependencies, initializer) {
    var self = dy.retrieveOrCreateModule(name)
    // Ensure all the dependencies exist
    dependencies = dependencies.map(function (dep) {
      return dy.retrieveOrCreateModule(dep)
    })
    initializer.apply(self, dependencies)
  }
  // Registry of all active modules
  dy.modules = {}

  dy.retrieveOrCreateModule = function (name) {
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
