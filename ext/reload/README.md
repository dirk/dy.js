
# dy.js reloader

This is a live-reloading system designed to function as both a helpful development tool and a reference implementation for extending the dy.js specification.

## Usage

Firstly, refer to the [`example/`](../../example) sample project for usage.

The reloader library is currently designed to work with express. You simply bind it to your server like so:

```js
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
dy('example', [], function () {
  ...
})
```

Then in your HTML you would setup dy.js and the reloader:

```html
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
```
