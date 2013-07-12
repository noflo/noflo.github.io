---
layout: documentation
title: Getting started with NoFlo
categories:
 - documentation
---
There are two ways to use NoFlo:

* _Independent_: Building the whole control logic of your software as a NoFlo graph, and running it with the `noflo` tool
* _Embedded_: Using NoFlo as a library and calling some NoFlo graphs whenever your software needs workflows

When you create a NoFlo graph, it doesn't do anything by itself. It only loads the components of the graph and sets up the connections between them. Then it is up to the components to actually start sending messages to their outports, or reacting to messages they receive on their inports.

Since most components require some input before they act, the usual way to make a NoFlo graph run is to send it some _initial information packets_, or IIPs. Examples of this would include sending a port number that a web server could listen to the web server component, or sending a file name to a file reader.

This activation model provides many possibilities:

* Starting the graph based on user interaction (shell command, clicking a button)
* Starting the graph based on a received signal (Redis pub/sub, D-Bus signal, WebHook, email)
* Starting the graph at a given time or interval (running a graph on the first of every month, or five minutes from now)
* Starting the graph based on context (when arriving to a physical location, when user goes to a given web site)

### Running the examples

File line count using _embedded_ NoFlo:

    $ coffee ./examples/linecount/count.coffee somefile.txt

File line count as an _individual_ NoFlo application:

    $ noflo -i
    NoFlo>> load examples/linecount/count.json

or

    $ noflo examples/linecount/count.json

Simple "Hello, world" web service with Basic authentication using _embedded_ NoFlo:

    $ coffee ./examples/http/hello.coffee

Then just point your browser to [http://localhost:8003/](http://localhost:8003/). Note that this example needs to have `connect` NPM package installed. Username is `user` and password is `pass`.

## Terminology

* Component: individual, pluggable and reusable piece of software. In this case a NoFlo-compatible CommonJS module
* Component Library: an NPM module providing a set of components for a particular domain (for example, *noflo-fs* for file operations components)
* Graph: the control logic of a FBP application, can be either in programmatical or file format
* Inport: inbound port of a component
* Network: collection of processes connected by sockets. A running version of a graph
* Outport: outbound port of a component
* Process: an instance of a component that is running as part of a graph (also known as Node in non-live graphs)
* Connection: connection between an outport of a Process, and inport of another Process (also known as Edge in non-live graphs)
* Initial Information Packet: predefined data packet sent to a defined inport of a Process
