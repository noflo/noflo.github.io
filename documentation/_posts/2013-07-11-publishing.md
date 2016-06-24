---
layout: documentation
title: Publishing component libraries
---

- [Publishing components for Node.js](#publishing-your-components-for-node-js)

- [Publishing components for Web Browsers](#publishing-your-components-for-web-browsers)

- [Auto-deploying to NPM using Travis](#auto-deploying-to-npm-using-travis)

- [Cross-platform libraries](#cross-platform-libraries)
  - [Platform annotations in souce code](#platform-annotations-in-source-code)
  - [Components that work on both platforms](#components-that-work-on-both-platforms)
  - [Platform annotations in source code](#platform-annotations-in-source-code)

- [Bootstrapping your library](#bootstrapping-your-library)

Developers can simply publish their own components independently without having to send pull requests to the main NoFlo repository. The same mechanism can also be used when publishing more traditional Node.js libraries to include the NoFlo components utilizing that library.

There are situations where a component only makes sense for a particular platform. For example, DOM manipulation is typically only useful in the browser, and only Node.js can serve HTTP.

## Publishing your components for Node.js <a id="publishing-your-components-for-node-js"></a>
Please refer to [the NPM documentation](https://npmjs.org/doc/developers.html) on how to publish packages in general.

## Publishing your components for web browsers <a id="publishing-your-components-for-web-browsers"></a>

In addition to Node.js, NoFlo component libraries can also be published for use in web browsers

Pushing this information to GitHub makes the component available. Use git tags to make new releases.



## Cross-platform libraries <a id="cross-platform-libraries"></a>

NoFlo component libraries can either be specific to one platform, or available for both Node.js and the browser. For cross-platform libraries there are some different strategies for dealing with the platform differences.

### Components that work on both platforms <components-that-work-on-both-platforms"></a>

The ideal setup is that a component would work the same way in both Node.js and the browser.

Since there are some differences between the environment, including different third-party libraries available, you can perform platform checks in runtime with:

```coffeescript
if noflo.isBrowser()
  # Do something specific to the browser environment
else
  # Do something specific to Node.js
```

## Platform annotations in source code <a id="platform-annotations-in-source-code"></a>

For future tooling purposes, and especially [Flowhub](http://flowhub.io), it is also useful to annotate platform-specific components as such.

Use the following syntax:

```coffeescript
# @runtime noflo-browser
```

The possible values for the `@runtime` annotation include:

* `noflo-browser` for browser-based components
* `noflo-nodejs` for Node.js components
* `noflo-gnome` for GNOME desktop components
* `microflo` for microcontroller components

## Auto-deploying to NPM using Travis <a id="auto-deploying-to-npm-using-travis"></a>
[npm deployment on travis](https://docs.travis-ci.com/user/deployment/npm)

### 1) Have the required gems installed
```
$ sudo gem install json
$ sudo gem install travis
```

### 2) log into npm
```
npm login
```

### 3) copy auth token
```
cat ~/.npmrc | grep _auth
```
You'll get ~ `‘//registry.npmjs.org/:_authToken=12aaeee1-1ee2-101a-1a11-1111aaaa1b23’.` copy the part after `‘_authToken=’`, in this case it is `12aaeee1-1ee2-101a-1a11-1111aaaa1b23`

### 4)
```
travis setup npm
```
enter the information it asks for, the npm API key is the one from step 3.


## Bootstrapping your library <a id="bootstrapping-your-library"></a>

You can perform all the steps above manually, but there is also a [grunt-init project scaffold](http://gruntjs.com/project-scaffolding) for NoFlo libraries.

Start by installing `grunt-init`:

```
$ npm install -g grunt-init
```

Then you can clone the [grunt-init-noflo](https://github.com/noflo/grunt-init-noflo) template to your local directory:

```
$ mkdir -p ~/.grunt-init
$ git clone https://github.com/noflo/grunt-init-noflo.git ~/.grunt-init/noflo
```

After this you can create new NoFlo component libraries easily. Create an empty directory, and run:

```
$ grunt-init noflo
```

The scaffold will ask you some questions. Answer those, and you'll be all ready for component development, including a continuous integration setup.
