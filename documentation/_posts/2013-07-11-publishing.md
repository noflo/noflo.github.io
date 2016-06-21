---
layout: documentation
title: Publishing component libraries
---
Developers can simply publish their own components independently without having to send pull requests to the main NoFlo repository. The same mechanism can also be used when publishing more traditional Node.js libraries to include the NoFlo components utilizing that library.

## Publishing your components for Node.js

Please refer to [the NPM documentation](https://npmjs.org/doc/developers.html) on how to publish packages in general. To publish NoFlo components, you simply need to amend the `package.json` file with the NoFlo metadata to register the components you're providing, like this:

```json
{
  "noflo": {
    "components": {
      "ParseYaml": "./components/ParseYaml.coffee",
      "ToYaml": "./components/ToYaml.coffee"
    }
  },
}
```

If you're publishing FBP graphs in either [.json](https://github.com/bergie/noflo/blob/master/examples/linecount/count.json) or [.fbp](https://github.com/bergie/noflo/blob/master/examples/linecount/count.fbp) format, just provide them similarly with the `graphs` key. Components can be either in CoffeeScript or JavaScript, the NoFlo ComponentLoader will handle the coffee compilation transparently.

For examples, check out [noflo-yaml](https://github.com/bergie/noflo-yaml), [noflo-core](https://github.com/noflo/noflo-core), or [ingres-table](https://github.com/c-base/ingress-table).

### Listing installed components

An additional benefit for this new structure is that now the NoFlo ComponentLoader can provide a list of installed components, which is also available on the noflo command-line. For example:

    $ noflo list ../noflo-webserver
    GroupByPacket (/home/bergie/Projects/noflo/src/components/GroupByPacket.coffee)
    Inports: in
    Outports: out
    ...
    Server (/home/bergie/Projects/noflo-webserver/components/Server.coffee)
    This component receives a port and host, and initializes a HTTP server for that combination. It sends out a request/response pair for each HTTP request it receives
    Inports: listen
    Outports: request

This same information is also be exposed to the web-based [Flowhub](http://flowhub.io) user interface using the [Component Protocol](http://noflojs.org/documentation/protocol/#component).

## Publishing your components for web browsers

In addition to Node.js, NoFlo component libraries can also be published for use in web browsers using [Component.io](https://github.com/component/component). Just like with NPM's `package.json`, you need to provide [a `component.json` file](https://github.com/componentjs/spec/blob/master/component.json/specifications.md) in the root of your GitHub repository. The structure is very similar to NPM's format.

In Component.io dependencies are declared using GitHub repository names, so for example you can depend on NoFlo as `noflo/noflo`.

The `component.json` needs to have a `noflo` key just like with NPM above:

```json
{
  "noflo": {
    "components": {
      "ParseYaml": "components/ParseYaml.coffee",
      "ToYaml": "components/ToYaml.coffee"
    }
  },
}
```

The declaration can also refer to graphs in the JSON format. In `component.json` you also have to list the files in the `script` array. Component.io also requires an `index.js` file to be present in your repository, but it can be left empty if you don't actually use it to expose a non-NoFlo API to your library.

```json
{
  "scripts": [
    "components/ParseYaml.coffee",
    "components/ToYaml.coffee",
    "index.js"
  ],
}
```

Since NoFlo's Component Loader has to traverse the dependency graph to find all browser components you also need to expose the `component.json` in the package. Do this via the `json` array:

```json
{
  "json": [
    "component.json"
  ],
}
```

Pushing this information to GitHub makes the component available. Use git tags to make new releases.

## Maintaining component and graph lists

It is possible to maintain the component and graph list in `package.json` and `component.json` manually, but this can become tedious. If you're using [Grunt](http://gruntjs.com/), there is a [grunt-noflo-manifest](https://github.com/noflo/grunt-noflo-manifest) that can be used to automate the maintenance of these lists.

Install the plugin and configure it in your Gruntfile:

```coffeescript
# Updating the package manifest files
noflo_manifest:
  update:
    files:
      'component.json': ['graphs/*', 'components/*']
      'package.json': ['graphs/*', 'components/*']
```

Make sure this task is run when needed, for example during the your testing phase.

## Cross-platform libraries

NoFlo component libraries can either be specific to one platform, or available for both Node.js and the browser. For cross-platform libraries there are some different strategies for dealing with the platform differences.

### Components that work on both platforms

The ideal setup is that a component would work the same way in both Node.js and the browser. In that case, simply declare it in the `noflo` `components` section of both `package.json` and `component.json`.

Since there are some differences between the environment, including different third-party libraries available, you can perform platform checks in runtime with:

```coffeescript
if noflo.isBrowser()
  # Do something specific to the browser environment
else
  # Do something specific to Node.js
```

### Platform-specific components

There are situations where a component only makes sense for a particular platform. For example, DOM manipulation is typically only useful in the browser, and only Node.js can serve HTTP.

In this case just declare the component in the relevant package file (`package.json` or `component.json`) and it will only appear in the correct environment.

If you want to have the same component API (name, ports) available for both platforms, but with different implementations, just point the same `component` key in the two package files to a different `.coffee` file.

#### Platform annotations in source code

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

## Bootstrapping your library

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
