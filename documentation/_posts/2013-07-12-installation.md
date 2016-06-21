---
layout: documentation
title: Requirements and installing
---
NoFlo is available [via NPM](https://npmjs.org/package/noflo), so you can install it with:

```bash
$ npm install noflo --save
```

### Installing from Git

NoFlo requires a reasonably recent version of [Node.js](http://nodejs.org/), and some [npm](http://npmjs.org/) packages. Ensure you have the `grunt-cli` package installed (`grunt` command should be available on command line) and NoFlo checked out from Git. Build NoFlo with:

```bash
$ grunt build
```

You can also build NoFlo only for the desired target platform with either `grunt build:nodejs` or `grunt build:browser`.

Then you can install everything needed by a simple:

```bash
$ npm link
```

NoFlo is available from [GitHub](https://github.com/noflo/noflo) under the MIT license.
