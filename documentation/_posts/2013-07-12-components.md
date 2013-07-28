---
layout: documentation
title: Components
---
A component is the main ingredient of flow-based programming. Component is a CommonJS module providing a set of input and output port handlers. These ports are used for connecting components to each other.

NoFlo processes (the boxes of a flow graph) are instances of a component, with the graph controlling connections between ports of components.

Since version 0.2.0, NoFlo has been able to utilize components shared via NPM packages. [Read the introductory blog post](http://bergie.iki.fi/blog/distributing-noflo-components/) to learn more.

### Structure of a component

Functionality a component provides:

* List of inports (named inbound ports)
* List of outports (named outbound ports)
* Handler for component initialization that accepts configuration
* Handler for connections for each inport

Minimal component written in CoffeeScript would look like the following:

```coffeescript
noflo = require "noflo"

class Forwarder extends noflo.Component
  description: "This component receives data on a single input 
  port and sends the same data out to the output port"

  constructor: ->
    # Register ports
    @inPorts =
      in: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.in.on "data", (data) =>
      # Forward data when we receive it.
      # Note: send() will connect automatically if needed
      @outPorts.out.send data

    @inPorts.in.on "disconnect", =>
      # Disconnect output port when input port disconnects
      @outPorts.out.disconnect()

exports.getComponent = -> new Forwarder()
```

This example component register two ports: _in_ and _out_. When it receives data in the _in_ port, it opens the _out_ port and sends the same data there. When the _in_ connection closes, it will also close the _out_ connection. So basically this component would be a simple repeater.

You can find more examples of components in the `components` folder shipping with NoFlo.

### Subgraphs

A NoFlo graph may contain multiple subgraphs, managed by instances of the `Graph` component. Subgraphs are useful for packaging particular flows to be used as a "new component" by other flows. This allows building more advanced functionality by creating reusable graphs of connected components.

The Graph component loads the graph given to it as a new NoFlo network, and looks for unattached ports in it. It then exposes these ports as its own inports or outports. This way a graph containing subgraphs can easily connect data between the main graph and the subgraph.

Unattached ports from the subgraph will be available through naming `ProcessName.port` on the Graph component instance.

Simple example, specifying what file a spreadsheet-parsing subgraph should run with:

```coffeescript
# Load a subgraph as a new process
'examples/spreadsheet/parse.fbp' -> GRAPH Reader(Graph)
# Send the filename to the component (subgraph)
'somefile.xls' -> READ.SOURCE Reader()
# Display the results
Reader() ENTITIZE.OUT -> IN Display(Output)
```

Just like with components, it is possible to share subgraphs via NPM. You have to register them in your `package.json`, for example:

```json
{
  "name": "noflo-spreadsheet",
  "noflo": {
    "graphs": {
      "Parse": "./graphs/parse.fbp"
    }
  }
}
```

After this the subgraph is available as a "virtual component" with the name `spreadsheet/Parse` and can be used just like any other component. Subgraphs exported in this manner can be in either JSON or the `.fbp` format.

### Some words on component design

Components should aim to be reusable, to do one thing and do it well. This is why often it is a good idea to split functionality traditionally done in one function to multiple components. For example, counting lines in a text file could happen in the following way:

* Filename is sent to a _Read File_ component
* _Read File_ reads it and sends the contents onwards to _Split String_ component
* _Split String_ splits the contents by newlines, and sends each line separately to a _Count_ component
* _Count_ counts the number of packets it received, and sends the total to a _Output_ component
* _Output_ displays the number

This way the whole logic of the application is in the graph, in how the components are wired together. And each of the components is easily reusable for other purposes.

If a component requires configuration, the good approach is to set sensible defaults in the component, and to allow them to be overridden via an input port. This method of configuration allows the settings to be kept in the graph itself, or for example to be read from a file or database, depending on the needs of the application.

The components should not depend on a particular global state, either, but instead attempt to keep the input and output ports their sole interface to the external world. There may be some exceptions, like a component that listens for HTTP requests or Redis pub-sub messages, but even in these cases the server, or subscription should be set up by the component itself.

When discussing how to solve the unnecessary complexity of software, _Out of the Tar Pit_ promotes an approach quite similar to the one discussed here:

> The first thing that we’re doing is to advocate separating out all complexity of any kind from the pure logic of the system (which - having nothing to do with either state or control - we’re not really considering part of the complexity).

Done this way, components represent the pure logic, and the control flow and state of the application is managed separately of them in the graph. This separation makes the system a lot simpler.

### Ports and events

Being a flow-based programming environment, the main action in NoFlo happens through ports and their connections. There are several events that can be associated with ports:

* _Attach_: there is a connection to the port
* _Connect_: the port has started sending or receiving a data transmission
* _BeginGroup_: the data stream after this event is associated with a given named group. Components may or may not utilize this information
* _Data_: an individual data packet in a transmission. There might be multiple depending on how a component operates
* _EndGroup_: A particular grouped stream of data ends
* _Disconnect_: end of data transmission
* _Detach_: A connection to the port has been removed

It depends on the nature of the component how these events may be handled. Most typical components do operations on a whole transmission, meaning that they should wait for the _disconnect_ event on inports before they act, but some components can also act on single _data_ packets coming in.

When a port has no connections, meaning that it was initialized without a connection, or a _detach_ event has happened, it should do no operations regarding that port.

### Conveniently add logging to your components

There are many ways to monitor the health of your flow based programmes, one way being to log important events from your components as they happen.  To help with this we provide a LoggingComponent base class which you can extend when you create your own components.  It will set up an initial outPorts data member with an out port named 'log'.  It also provides a convenience method for sending log messages.  When the log port is not attached, it will send the log messages to the console.

Here's a version of the Forwarder component from above that logs messages when it can't send them.

```coffeescript
noflo = require "noflo"

class LoggingForwarder extends noflo.Component
  description: "This component receives data on a single input
  port and sends the same data out to the output port"

  constructor: ->
    # Register ports
    @inPorts =
      in: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.in.on "data", (data) =>
      # Forward data when we receive it.
      if @outports.out.isAttached()
        @outPorts.out.send data
        return
      @sendLog
        logLevel: "error"
        message: "Received message '#{data} on IN port but OUT port isn't attached."

    @inPorts.in.on "disconnect", =>
      # Disconnect output port when input port disconnects
      @outPorts.out.disconnect()

exports.getComponent = -> new LoggingForwarder()
```

You can send objects, as I have done in this example, or simple strings, numbers etc.  This isn't the only way to log but it is provided here for your convenience should you wish to use it.
