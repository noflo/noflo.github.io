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

Minimal component written in NoFlo would look like the following:

```coffeescript
# File: components/Forwarder.coffee
noflo = require "noflo"

exports.getComponent = ->
  component = new noflo.Component
  component.description = "This component receives data on a single input
  port and sends the same data out to the output port"

  # Register ports and event handlers
  component.inPorts.add 'in', datatype: 'all', (event, payload) ->
    switch event
      when 'data'
        # Forward data when we receive it.
        # Note: send() will connect automatically if needed
        component.outPorts.out.send data
      when 'disconnect'
        # Disconnect output port when input port disconnects
        component.outPorts.out.disconnect()
  component.outPorts.add 'out', datatype: 'all'

  component # Return new instance
```

```javascript
// File: components/Forwarder.js
var noflo = require("noflo");

exports.getComponent = function() {
  var component = new noflo.Component;
  component.description = "This component receives data on a single input\
  port and sends the same data out to the output port";

  // Register ports and event handlers
  component.inPorts.add('in', { datatype: 'all' }, function(event, payload) {
    switch (event) {
      case 'data':
        // Forward data when we receive it.
        // Note: send() will connect automatically if needed
        return component.outPorts.out.send(data);
      case 'disconnect':
        // Disconnect output port when input port disconnects
        return component.outPorts.out.disconnect();
    }
  });
  component.outPorts.add('out', { datatype: 'all' });

  return component; // Return new instance
};
```

This example component register two ports: _in_ and _out_. When it receives data in the _in_ port, it opens the _out_ port and sends the same data there. When the _in_ connection closes, it will also close the _out_ connection. So basically this component would be a simple repeater.

The `exports.getComponent` function is used by NoFlo to create an instance of the component. See [Component Lifecycle](#lifecycle) for more information.

You can find more examples of components in the [component library](/library/) section of this website.

### Asynchronous components

In addition to the regular `noflo.Component` baseclass, there is an additional `noflo.AsyncComponent` baseclass that helps in creating components that perform asynchronous operations in a consistent way. See the [Async Components](/documentation/async-components/) document for more information.

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

<a id="design"></a>
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

<a id="lifecycle"></a>
### Component lifecycle

When NoFlo is being run, all components used in a NoFlo network (an instantiated graph) go through the following lifecycle steps:

* _Instantiation_: component is instantiated for a node in the NoFlo graph, and its `constructor` method is called. At this stage a component should prepare its internal data structures and register listeners for the [events of its input ports](#portevents)
* _Running_: component has received events on its input ports. Now the component can interact with those events and the external world, and optionally start transmitting [port events](#portevents) on its output ports
* _Shutdown_: Normally a NoFlo network finishes when all components stop transmitting port events. It is however also possible to close a running NoFlo network. In this case the `shutdown` method of components gets called, allowing components to perform whatever cleanup needed, like unregistering event listeners on external objects, or closing network connections

A running instance of a component in a NoFlo network is called a *process*. Before a process has received data it should be *inert*, merely listening to its input ports. Processes that need to start doing something when a network is started should be triggered to do so by sending them an Initial Information Packet.

<a id="portevents"></a>
### Ports and events

Being a flow-based programming environment, the main action in NoFlo happens through ports and their connections. All actions a component does should be triggered via input port events. There are several events that can be associated with ports:

* _Attach_: there is a connection to the port
* _Connect_: the port has started sending or receiving a data transmission
* _BeginGroup_: the data stream after this event is associated with a given named group. Components may or may not utilize this information
* _Data_: an individual data packet in a transmission. There might be multiple depending on how a component operates
* _EndGroup_: A particular grouped stream of data ends
* _Disconnect_: end of data transmission
* _Detach_: A connection to the port has been removed

It depends on the nature of the component how these events may be handled. Most typical components do operations on a whole transmission, meaning that they should wait for the _disconnect_ event on inports before they act, but some components can also act on single _data_ packets coming in.

When a port has no connections, meaning that it was initialized without a connection, or a _detach_ event has happened, it should do no operations regarding that port.

### Port data types

NoFlo is a flow-based programming environment for JavaScript, and JavaScript utilizes dynamic typing. Because of this, NoFlo component ports don't impose type safety, and the output of any port can be connected to the input of any other port. This means that any type checking or type conversions should be handled inside the components themselves.

To aid users in designing graphs, it is however possible to annotate ports with the data type they expect to receive or transmit. This data type is given as a string value of the `datatype` attribute when adding a port to a component. For example:

```coffeescript
component.inPorts.add 'in', datatype: 'string'
component.inPorts.add 'options', datatype: 'object'
```
```javascript
component.inPorts.add('in', { datatype: 'string' });
component.inPorts.add('options', { datatype: 'object' });
```

The data types supported by NoFlo include:

* _all_: the port can deal with any data type
* _bang_: the port doesn't do anything with the contents of a data packet, only with the fact that a packet was sent
* _string_
* _boolean_
* _number_
* _int_
* _object_
* _array_
* _color_
* _date_
* _function_
* _buffer_

### Port attributes

There is a set of other attributes a port may have apart from its `datatype`:

* `addressable`: this boolean flag makes turns the port into an _Array port_, giving a particular index for each connection attached to it (_default: `false`_);
* `buffered`: buffered ports save data in the buffer to be `read()` explicitly instead of passing it immediately to event handler (_default: `false`_);
* `cached`: this option makes an output port re-send last emitted value when new connections are established (_default: `false`_);
* `datatype`: string type name of data the port accepts, see above (_default: `all`_);
* `description`: provides human-readable description of the port displayed in documentation and in [Flowhub](http://flowhub.io) inspector;
* `required`: indicates that a connection on the port is required for component's functioning (_default: `false`_);
* `values`: sets the list of accepted values for the port, if the value received is not in the list an error is thrown (_default: `null`_).

Here is how multiple attributes can be combined together with event handlers:

```coffeescript
component.inPorts.add 'id',
  datatype: 'int'
  description: 'Request ID'

component.inPorts.add 'user',
  datatype: 'object'
  description: 'User data'
, (event, payload) ->
  # Do something with event and payload here
  if event is 'data'
    component.outPorts.out.send payload
    component.outPorts.out.disconnect()
```
```javascript
component.inPorts.add('id', {
  datatype: 'int',
  description: 'Request ID'
});

component.inPorts.add('user', {
  datatype: 'object',
  description: 'User data'
}, function (event, payload) {
  // Do something with event and payload here
  if (event === 'data') {
    component.outPorts.out.send(payload);
    component.outPorts.out.disconnect();
  }
});
```

<a id="icons"></a>
### Component icons

For use in visual editors like [Flowhub](http://flowhub.io/), components can provide an icon. The icons are based on the [Font Awesome icon set](http://fontawesome.io/icons/), but without the `fa-` prefix.

A component that takes a picture could for instance use the [Camera icon](http://fontawesome.io/icon/camera/). The icons are declared using the `icon` property of the component:

```coffeescript
# File: components/TakePicture.coffee
exports.getComponent = ->
  component = new noflo.Component
  component.description = "Take a photo with the computer's web camera"
  component.icon = 'camera'
```
```javascript
// File: components/TakePicture.js
exports.getComponent = function() {
  var component = new noflo.Component();
  component.description = "Take a photo with the computer's web camera";
  component.icon = 'camera';
```

Icons can also be updated during runtime to reflect a changing state of the component. This is accomplished by calling the `setIcon` method of the component. For example, the *TakePicture* component above could temporarily set its icon when a picture has been taken to a [Picture icon](http://fontawesome.io/icon/picture-o/) and then change it back a bit later:

```coffeescript
component.originalIcon = component.getIcon()
component.setIcon 'picture-o'
component.timeout = setTimeout =>
  component.setIcon component.originalIcon
  component.timeout = null
, 200
```
```javascript
component.originalIcon = component.getIcon();
component.setIcon('picture-o');
component.timeout = setTimeout(function() {
  component.setIcon(component.originalIcon);
  component.timeout = null;
}, 200);
```

<a id="logging"></a>
### Conveniently add logging to your components

There are many ways to monitor the health of your flow based programmes, one way being to log important events from your components as they happen.  To help with this we provide a LoggingComponent base class which you can extend when you create your own components.  It will set up an initial outPorts data member with an out port named 'log'.  It also provides a convenience method for sending log messages.  When the log port is not attached, it will send the log messages to the console.

Here's a version of the Forwarder component from above that logs messages when it can't send them.

```coffeescript
noflo = require "noflo"

class LoggingForwarder extends noflo.LoggingComponent
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
      if @outPorts.out.isAttached()
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
