---
layout: documentation
title: Getting started with NoFlo
categories:
 - documentation
---
NoFlo is a [Flow-Based Programming](http://en.wikipedia.org/wiki/Flow-based_programming) environment for JavaScript. In flow-based programs, the logic of your software is defined as a *graph*. The *nodes* of the graph are instances of NoFlo components, and the *edges* define the connections between them.

NoFlo components react to incoming messages, or *packets*. When a component receives packets in its input ports it performs a predefined operation, and sends its result out as a packet to its output ports. There is no shared state, and the only way to communicate between components is by sending packets.

NoFlo components are built as simple JavaScript or [CoffeeScript](http://coffeescript.org/) classes that define the input and output ports, and register various event listeners on them. When executed, NoFlo creates a live graph, or *network* out of a graph, instantiates the components used in the graph, and connects them together.

NoFlo graphs can deal with multiple different input paradigms. The same flow can react to incoming HTTP requests, text messages, and changes in the file system, and can similarly output to different targets like writing to a database, responding to the HTTP requests, or updating a dashboard. It is simply a matter of choosing the components you want to use.

## Video tutorial: Creating a web server

<iframe src="//player.vimeo.com/video/79814291?color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

[Leo Zovic briefly introduces noflo -- Toronto FBP Meeting 1](https://vimeo.com/79814291)

## Using NoFlo

There are two ways to run your flow-based programs with NoFlo. If your whole application is based on flows, you can simply have NoFlo execute and run it. Flow-based programs done in this way are called *independent* graphs. You can run them with the `noflo` command that ships with the NoFlo package.

The other option is to *embed* NoFlo graphs into your existing JavaScript application by using it as a regular Node.js library. This is useful when you already have an existing system where you want to automate some parts as their own flows, or to add new functionality.

Examples of embedded usage of NoFlo include handling billing processes or routing incoming SMS or email within an existing Node.js web application.

### Activation model

When you start a NoFlo network, it doesn't do anything by itself. It only loads the components of the graph and sets up the connections between them. Then it is up to the components to actually start sending messages to their outports, or reacting to messages they receive on their input ports.

Since most components require some input before they act, the usual way to make a NoFlo graph run is to send it some initial information packets, or *IIPs*. Examples of this would include sending a port number that a web server could listen to the web server component, or sending a file name to a file reader.

This activation model provides many possibilities:

* Starting a flow based on user interaction (shell command, clicking a button)
* Starting a flow based on a received signal (Redis pub/sub, D-Bus signal, WebHook, email)
* Starting a flow at a given time or interval (running a graph on the first of every month, or five minutes from now)
* Starting a flow based on context (when arriving to a physical location, when user goes to a given web site)

## Creating a NoFlo project

NoFlo projects are created in the same way as any other Node.js project would. To get started, you need a working installation of [Node.js](http://nodejs.org/) (version 0.8 or later), and the [NPM](https://npmjs.org/) package manager that comes with it.

You can test that your Node.js installation works by running:

```bash
$ npm -v
```

If this doesn't work, read the [Node.js installation instructions](http://nodejs.org/download/) for your operating system.

### Project folder

To create a new project, you should create a new folder in the file system. This folder will contain all the files specific to your project, including dependency declarations, unit tests, and the NoFlo graphs and components. This is what you’ll usually want to manage in version control.

```bash
$ mkdir my-noflo-example-app
```

Then go to that folder:

```bash
$ cd my-noflo-example-app
```

### Installing NoFlo

The first thing to do with your project is to create a `package.json` file into the project root. This is the file that is used by NPM for finding and installing the libraries your project needs.

A basic `package.json` file could look like the following. Create one using a text editor:

```json
{
  "name": "my-noflo-example-app",
  "version": "0.0.1"
}
```

Once the `package.json` file is in place, you're ready to install NoFlo. Do this by running:

```bash
$ npm install noflo --save
```

NPM will fetch the latest release version of NoFlo and all its dependencies. If you want to run NoFlo on Node.js via command-line, you'll also want to grab [noflo-nodejs](https://npmjs.org/package/noflo-nodejs):


```bash
$ npm install noflo-nodejs --save
```

Once this has finished, try that NoFlo works by running:

```bash
$ ./node_modules/.bin/noflo-nodejs -h
```

### Getting components

The main NoFlo package gives you the environment for running flows. In addition you'll need the components that you'll be using in your graphs.

There are hundreds of open source components available via [NoFlo Component Libraries](https://www.npmjs.com/browse/depended/noflo) that you can install with NPM.

For example, to install the [filesystem components](https://www.npmjs.com/package/noflo-filesystem/), you can run:

```bash
$ npm install noflo-filesystem --save
```

We should also install [noflo-core](https://www.npmjs.com/package/noflo-core), which provides various general utility components:

```bash
$ npm install noflo-core --save
```

Once NPM completes the components from that library will be available to your project. Your project can pull in components from as many NoFlo libraries as needed.

## Defining your first graph

All NoFlo programs are built as graphs, which define the nodes and components used, and connections between them.

NoFlo graphs can be either defined in a [JSON file format](/documentation/json/) or using the [`.fbp` domain-specific language](/documentation/fbp/). For brevity, this guide uses the `.fbp` syntax.

Our first graph can be a simple one. Since we already have the file system components available, we can implement a graph that reads a file, and outputs its contents on the screen.

Graphs are typically stored in the graphs subfolder of a NoFlo project. Create that folder:

```bash
$ mkdir graphs
```

Create a new file in that folder called `ShowContents.fbp` and open it in your favorite text editor. Paste in the following contents:

```coffeescript
# In the graph we first need to define the nodes and the connections between them
Read(filesystem/ReadFile) OUT -> IN Display(core/Output)

# Start off the graph by sending a filename to the file reader
'package.json' -> IN Read
```

Once you've saved the file you can run the graph with NoFlo:

```bash
$ ./node_modules/.bin/noflo-nodejs --graph graphs/ShowContents.fbp --batch --register=false
```

The contents of your `package.json` should be shown on the console.

### Debugging the graph

If you want to see how the graph works internally, you can run NoFlo with the debugger:

```bash
$ ./node_modules/.bin/noflo-nodejs --graph graphs/ShowContents.fbp --batch --register=false --debug
```

This will show all the various events happening inside the graph:

* Connections being opened
* Package groups being started and finished
* Data being sent through the connections
* Connections being closed

Looking at this is useful in order to understand how information flows through a NoFlo network.

## Building a simple calculator

NoFlo has a [wealth of components](/library/) available. One such example is the [noflo-math](https://www.npmjs.com/package/noflo-math), which can be used for performing simple calculations.

Install it with:

```bash
$ npm install noflo-math --save
```

Now we can build a simple calculator. For example, to multiply numbers we can create the following graph at `graphs/Calculate.fbp`:

```coffeescript
'6' -> MULTIPLICAND Multiply(math/Multiply)
'7' -> MULTIPLIER Multiply
Multiply PRODUCT -> IN Display(core/Output)
```

If you run this with:

```bash
$ ./node_modules/.bin/noflo-nodejs --graph graphs/Calculate.fbp --batch --register=false
```

it will give the answer of `42`. Doing other mathematical operations with noflo-math is left as an exercise to the user.
