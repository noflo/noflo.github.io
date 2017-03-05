---
layout: documentation
title: Publishing modules
---
- [Module structure](#module-structure)
- [Publishing your module](#publishing-your-module)
- [Cross-platform modules](#cross-platform-modules)
  - [Components that work on both platforms](#components-that-work-on-both-platforms)
  - [Platform-specific components](#platform-specific-components)
  - [Aliasing components](#aliasing-components)
- [Best practices](#best-practices)
  - [Release automation with Travis CI](#release-automation-with-travis-ci)
- [Bootstrapping modules](#bootstrapping-modules)

NoFlo modules are distributed via the [NPM package registry](https://www.npmjs.com). You can see a [list of reusable NoFlo modules](https://www.npmjs.com/browse/keyword/noflo) using the `noflo` keyword.

Developers can publish their own NoFlo modules by simply releasing them on NPM. The module can be NoFlo-only, but it is also possible to include NoFlo components and graphs in any NPM module.

## Module structure

To provide NoFlo components, an NPM module should provide the following structure:

* `package.json`: The module manifest listing dependencies and other package metadata
* `components/`: directory used for finding components. Components can be either `.coffee` or `.js` files
* `graphs/`: directory used for finding graphs. Graphs can be either `.json` or `.fbp` files

Both the `components/` and `graphs/` directory contain subfolders. This is useful for further organization if your module ships many components or graphs.

## Publishing your module

Please refer to [the NPM documentation](https://npmjs.org/doc/developers.html) on how to publish packages in general.

To make your module discoverable to NoFlo users, it is a good idea to include the `noflo` keyword in your `package.json`:

```json
  "keywords": [
    "noflo"
  ],
```

The NPM registry can also be used for publishing private modules.

## Cross-platform modules


NoFlo components or graphs can either be specific to one platform, or available for both Node.js and the browser. For cross-platform libraries there are some different strategies for dealing with the platform differences. By default NoFlo assumes that each component or graph works in both Node.js and the browser.

There are situations where a component only makes sense for a particular platform. For example, DOM manipulation is typically only useful in the browser, and only Node.js can serve HTTP.

### Components that work on both platforms

The ideal setup is that a component would work the same way in both Node.js and the browser.

Since there can be some differences between the environment, including different third-party libraries available, you can perform platform checks at runtime with:

```javascript
if (noflo.isBrowser()) {
  // Do something specific to the browser environment
} else {
  // Do something specific to Node.js
}
```

### Platform-specific components

If you have components or graphs that only work on one of the platforms, you can use _runtime annotations_  to tell NoFlo which platform a component works on.

To tell NoFlo that a component works only in the browser, add the following comment to beginning of the source file:

```javascript
// @runtime noflo-browser
```

If the component works only on Node.js, use the following comment:

```javascript
// @runtime noflo-nodejs
```

The possible values for the `@runtime` annotations include:

* `noflo-browser` for browser-based components
* `noflo-nodejs` for Node.js components
* `noflo-gnome` for GNOME desktop components
* `microflo` for microcontroller components

### Aliasing components

If you want to provide the same component interface on multiple platforms, but need different implementations for each, you can use the _name annotation_ to alias a file to a different component name.

For example, if you have a `LoadImage` component, with platform-specific implementations, you could have:

`components/LoadImage-browser.js` file:

```javascript
// @runtime noflo-browser
// @name LoadImage
```

`components/LoadImage-node.js` file:

```javascript
// @runtime noflo-nodejs
// @name LoadImage
```

## Best practices

To make NoFlo modules easy to maintain, it is a good idea to aim for a good [test coverage](../testing).

When the module has tests, there are useful services to automate parts of the module maintenance work:

* [Travis CI](https://travis-ci.org) can be used for continuous integration
* [Greenkeeper](https://greenkeeper.io) can send you Pull Requests when any of your module dependencies get updated

### Release automation with Travis CI

In addition to running your test suite, [Travis CI can be configured](https://docs.travis-ci.com/user/deployment/npm) to automatically release new versions of your module on NPM whenever you `git tag` it.

#### 1) Have the required gems installed

```bash
$ sudo gem install json
$ sudo gem install travis
```

#### 2) log into npm

```bash
$ npm login
```

#### 3) copy auth token

```bash
$ cat ~/.npmrc | grep _auth
```

You'll get ~ `‘//registry.npmjs.org/:_authToken=12aaeee1-1ee2-101a-1a11-1111aaaa1b23’.` copy the part after `‘_authToken=’`, in this case it is `12aaeee1-1ee2-101a-1a11-1111aaaa1b23`

#### 4) configure travis

```bash
$ travis setup npm
```

enter the information it asks for, the npm API key is the one from step 3.

## Bootstrapping modules

For faster setup of new NoFlo modules, we have a [grunt-init project scaffold](http://gruntjs.com/project-scaffolding) template for NoFlo libraries.

Start by installing `grunt-init`:

```bash
$ npm install -g grunt-init
```

Then you can clone the [grunt-init-noflo](https://github.com/noflo/grunt-init-noflo) template to your local directory:

```bash
$ mkdir -p ~/.grunt-init
$ git clone https://github.com/noflo/grunt-init-noflo.git ~/.grunt-init/noflo
```

After this you can create new NoFlo modules easily. Create an empty directory, and run:

```bash
$ grunt-init noflo
```

The scaffold will ask you some questions. Answer those, and you'll be all ready for component development, including a continuous integration setup.
