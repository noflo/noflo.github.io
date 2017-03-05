---
title: Components
layout: documentation
---
- [Component API](#component-api)
  - [The process function](#the-process-function)
  - [Handling preconditions](#handling-preconditions)
  - [Processing packets](#processing-packets)
  - [Sending packets](#sending-packets)
- [Component lifecycle](#component-lifecycle)
  - [Setup and teardown](#setup-and-teardown)
  - [Generator components](#generator-components)

-------------
NoFlo programs consist of graphs where different nodes are connected together. These nodes can themselves be graphs, or they can be components written in JavaScript.

A NoFlo component is simply a [JavaScript module](https://www.sitepoint.com/understanding-module-exports-exports-node-js/) that provides a certain interface that allows NoFlo to run it.

## Component API

So, how does a NoFlo component written in JavaScript look like?

```javascript
// Load the NoFlo interface
var noflo = require('noflo');
// Also load any other dependencies you have
var fs = require('fs');

// Implement the getComponent function that NoFlo's component loader
// uses to instantiate components to the program
exports.getComponent = function () {
  // Start by instantiating a component
  var c = new noflo.Component();

  // Provide some metadata, including icon for visual editors
  c.description = 'Reads a file from the filesystem';
  c.icon = 'file';

  // Declare the ports you want your component to have, including
  // their data types
  c.inPorts.add('in', {
    datatype: 'string'
  });
  c.outPorts.add('out', {
    datatype: 'string'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });

  // Implement the processing function that gets called when the
  // inport buffers have packets available
  c.process(function (input, output) {
    // Precondition: check that the "in" port has a data packet.
    // Not necessary for single-inport components but added here
    // for the sake of demonstration
    if (!input.hasData('in')) {
      return;
    }

    // Since the preconditions matched, we can read from the inport
    // buffer and start processing
    var filePath = input.getData('in');
    fs.readFile(filePath, 'utf-8', (err, contents) {
      // In case of errors we can just pass the error to the "error"
      // outport
      if (err) {
        output.done(err);
        return;
      }

      // Send the file contents to the "out" port
      output.send({
        out: contents
      });
      // Tell NoFlo we've finished processing
      output.done();
    });
  });

  // Finally return to component to the loader
  return c;
}
```

### The process function

NoFlo components call their processing function whenever they've received packets to any of their regular inports.

In general any new information packets received by the component cause the `process` function to trigger. However, there are some exceptions:

* Non-triggering ports don't cause the function to be called
* Ports that have been set to forward brackets don't cause the function to be called on bracket IPs, only on data

### Handling preconditions

When the processing function is called, the first job is to determine if the component has received enough data to act. These "[firing rules](http://ptolemy.eecs.berkeley.edu/papers/97/dataflow/)" can be used for checking things like:

* When having multiple inports, do all of them contain data packets?
* If multiple input packets are to be processed together, are all of them available?
* If receiving a [stream of packets](http://jpaulmorrison.com/fbp/substrs.shtml) is the complete stream available?
* Any input synchronization needs in general

The NoFlo component input handler provides methods for checking the contents of the input buffer. Each of these return a boolean if the conditions are matched:

* `input.has('portname')` whether an input buffer contains packets of any type
* `input.hasData('portname')` whether an input buffer contains data packets
* `input.hasStream('portname')` whether an input buffer contains at least one complete stream of packets

For convenience, `has` and `hasData` can be used to check multiple ports at the same time. For example:

```javascript
// Fail precondition check unless both inports have a data packet
if (!input.hasData('in1', 'in2')) return;
```

For more complex checking it is also possible to pass a validation function to the `has` method. This function will get called for each information packet in the port(s) buffer:

```javascript
// We want to process only when color is green
var validator = function (packet) {
  if (packet.data.color === 'green') {
    return true;
  }
  return false;
}
// Run all packets in in1 and in2 through the validator to
// check that our firing conditions are met
if (!input.has('in1', 'in2', validator)) return;
```

The firing rules should be checked in the beginning of the processing function before we start actually reading packets from the buffer. At that stage you can simply finish the run with a `return`.

### Processing packets

Once your preconditions have been met, it is time to read packets from the buffers and start doing work with them.

For reading packets there are equivalent `get` functions to the `has` functions used above:

* `input.get('portname')` read the first packet from the port's buffer
* `input.getData('portname')` read the first data packet, discarding preceding bracket IPs if any
* `input.getStream('portname')` read a whole stream of packets from the port's buffer

For `get` and `getStream` you receive whole [IP objects](https://noflojs.org/api/IP/). For convenience, `getData` returns just the data payload of the data packet.

When you have read the packets you want to work with, the next step is to do whatever your component is supposed to do. Do some simple data processing, call some remote API function, or whatever. NoFlo doesn't really care whether this is done synchronously or asynchronously.

**Note:** once you read packets from an inport, the component activates. After this it is necessary to finish the process by calling `output.done()` when you're done.

### Sending packets

While the component is active, it can send packets to any number of outports using the `output.send` method. This method accepts a map of port names and information packets.

```javascript
output.send({
  out1: new noflo.IP('data', "some data"),
  out2: new noflo.IP('data', [1, 2, 3])
});
```

For data packets you can also just send the data as-is, and NoFlo will wrap it to an information packet.

Once you've finished processing, simply call `output.done()` to deactivate the component. There is also a convenience method that is a combination of `send` and `done`. This is useful for simple components:

```javascript
c.process(function (input, output) {
  var data = input.getData('in');
  // We just add one to the number we received and send it out
  output.sendDone({
    out: data + 1
  });
});
```

In normal situations there packets are transmitted immediately. However, when working on individual packets that are part of a stream, NoFlo components keep an output buffer to ensure that packets from the stream are transmitted in original order.

## Component lifecycle

The following diagram shows the lifecycle of a NoFlo program:

![NoFlo program lifecycle](/img/network-lifecycle.png)

The component lifecycle is quite similar to the program lifecycle shown above. There are three states:

* Initialized: the component has been instantiated in a NoFlo graph
* Activated: the component has read some data from inport buffers and is processing it
* Deactivated: all processing has finished

Once all components in a NoFlo network have deactivated, the whole program is finished.

Components are only allowed to do work and send packets when they're activated. They shouldn't do any work before receiving input packets, and should not send anything after deactivating.

### Setup and teardown

If your component needs to do anything special at start-up or shutdown, you can implement the following methods for the component:

`component.setUp(callback)` called when network starts. Component can do self-initialization but should not send anything at this stage.

`component.tearDown(callback)` called when network stops. Stateful components can clean their state at this point, and generators should stop generating (remove event listeners, shut down socket connections, etc).

### Generator components

Regular NoFlo components only send data associated with input packets they've received. One exception is generators, a class of components that can send packets whenever something happens.

Some examples of generators include:

* Network servers that listen to requests
* Components that wait for user input like mouse clicks or text entry
* Timer loops

The same rules of "only send when activated" apply also to generators. However, they can utilize the processing context to self-activate as needed:

```javascript
exports.getComponent = function () {
  var c = new noflo.Component();
  c.inPorts.add('start', { datatype: 'bang' });
  c.inPorts.add('stop', { datatype: 'bang' });
  c.outPorts.add('out', { datatype: 'bang' });
  // Generators generally want to send data immediately and
  // not buffer
  c.autoOrdering = false;

  // Helper function for clearing a running timer loop
  var cleanup = function () {
    // Clear the timer
    clearInterval(c.timer.interval);
    // Then deactivate the long-running context
    c.timer.deactivate();
    c.timer = null;
  }

  // Receive the context together with input and output
  c.process(function (input, output, context) {
    if (input.hasData('start')) {
      // We've received a packet to the "start" port
      // Stop the previous interval and deactivate it, if any
      if (c.timer) {
        cleanup();
      }
      // Activate the context by reading the packet
      input.getData('start');
      // Set the activated context to component so it can
      // be deactivated from the outside
      c.timer = context
      // Start generating packets
      c.timer.interval = setInterval(function () {
        // Send a packet
        output.send({
          out: true
        });
      }, 100);
      // Since we keep the generator running we don't
      // call done here
    }

    if (input.hasData('stop')) {
      // We've received a packet to the "stop" port
      input.getData('stop');
      if (!c.timer) {
        // No timers running, we can just finish here
        output.done();
        return;
      }
      // Stop the interval and deactivate
      cleanup();
      // Also call done for this one
      output.done();
    }
  });

  // We also may need to clear the timer at network shutdown
  c.tearDown = function (callback) {
    if (c.timer) {
      // Stop the interval and deactivate
      cleanup();
    }
    c.emit('end');
    c.started = false;
    callback();
  }

  return c;
}
```
