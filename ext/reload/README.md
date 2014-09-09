
# dy.js reloader

This is a live-reloading system designed to function as both a helpful development tool and a reference implementation for extending the dy.js specification.

## Usage

Firstly, refer to the [`example/`](../../example) sample project for usage.

The reloader library is currently designed to work with express. You simply bind it to your server like so:

```js
// app.js

// setting up your express application
app = express()
...

var server = app.listen(3000)
// Setup a reloader sub-server on the application and its server
var reloader = new dy.Reloader(app, server)
reloader.addReloadable(new dy.Reloadable('example', {
  watch: './public/js/example.js',
  reload: '/js/example.js'
}))
```

This assumes you have a dy.js module defined in `public/js/example.js`:

```js
// public/js/example.js
dy('example', [], function () {

  this._load = function () {
    // This will be executed every time the module is loaded
    var el = document.getElementById('main')
    el.innerText = 'Hello from example at '+(new Date()).getTime()
  }
  this._unload = function () {
    // This will be called when the module is unloaded
    var el = document.getElementById('main')
    el.innerText = 'example: Unloaded'
  }

})
```

Then in your HTML you would setup dy.js and the reloader:

```html
<!-- index.html -->

<!-- from public/js/ -->
<script type="text/javascript" src="/js/dy.js"></script>
<script type="text/javascript" src="/js/example.js"></script>
<!-- from dy.Reloader -->
<script type="text/javascript" src="/.dy/browser.js"></script>
<!-- setup -->
<script type="text/javascript">
window.onload = function () {
  dy.load()
  var reloader = new dy.Reloader(dy)
  reloader.setup()
}
</script>

<div id="main">Hello from the HTML</div>
```

Now every time `public/js/example.js` is changed it will be reloaded in the browser. In detail the process looks like:

1. The *dy.Reloader* adds itself to the Node express server
2. The *dy.Reloader* in the browser does `GET /.dy/reloadables.json` to the server library to get a manifest of modules it should reload (this is set up when you call `reloader.addReloadable` on the server library)
3. The server library watches reloadable files for changes
4. When it detects a change it sends a message to the browser through the `/.dy/primus` websocket
5. The browser receives the message and creates a new `<script>` tag with the correct file to load, adds an `onload` handler to it, and then injects it into the DOM
6. The browser loads the source of the `<script>` tag (which is the new module); the `dy('example' ...)` call in that source file updates the definition of the *example* module in the browser's `dy` manager
7. When the browser is done loading that `<script>` tag it calls the `onload` handler; that handler then fires the `_load()` trigger on the now-reloaded module
8. The `_load()` trigger on the *example* module updates the "Hello from example ..." text in the DOM.

