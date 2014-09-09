
# dy.js

We've put humans on the moon and rovers on Mars. So why the bloody hell is save-and-reload still acceptable as the cornerstone of our development workflow? dy.js is proposed methodology (specification?) and reference implementation for module-based dynamic code reloading in (initially) the browser.

## Philosophy

dy.js is designed to be simple, humanist software. As such, it's guiding philosophy is centered around understandability and ease of use:

1. Simple module dependency injection
2. Simple module reloading extension
3. Code that JavaScript programmers of nearly all skill levels should be able to understand

## Reloader

dy.js provides an extension library that allows for automatic code reloading of modules that follow the specification. See the [reloader `README.md`](ext/reload/) for reference.

### License

Released under the New BSD License (1999); see `LICENSE` for details.
