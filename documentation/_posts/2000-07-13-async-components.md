---
layout: documentation
title: Async Components
---

# Async
Asynchronous components process data and send output some time later. The outputs are sent in the order that they are processed, which might be a different than the order received.

Previously, we used a dedicated class named `AsyncComponent` which would be extended.

Now,

(process api)[process api] is asynchronous by default.

WirePattern can be used for async by setting the `async` property.

-----------

Asynchronous components process data and send output some time later. The outputs are sent in the order that they are processed, which might be a different than the order received. To keep track of the in/out data correspondence, outputs are sent with a group marked with the input data.

To make it easier to build asynchronous components, there is an `AsyncComponent` class to extend. The constructor's `super` method takes the keys of the primary in and out port that will be asynchronous. `doAsync` is then called with each input.

### AsyncComponent Example

This browser example loads and measures images. Notice how the output group is marked with the input `url`.

```coffeescript
noflo = require 'noflo'

class Measure extends noflo.AsyncComponent
  description: 'Load image from URL and get dimensions'
  icon: 'picture-o'
  constructor: ->
    @inPorts =
      url: new noflo.Port 'string'
    @outPorts =
      dimensions: new noflo.Port 'array'
      error: new noflo.Port 'object'
    super 'url', 'dimensions'

  doAsync: (url, callback) ->
    image = new Image()

    # Connect to let receiving end know we're going to send data
    @outPorts.dimensions.connect()

    image.onload = =>
      if (image.naturalWidth? and image.naturalWidth is 0) or image.width is 0
        image.onerror new Error "#{url} didn't come back as a valid image."
        return
      dimensions = [image.width, image.height]

      # Add local group information
      @outPorts.dimensions.beginGroup url
      # Send data
      @outPorts.dimensions.send dimensions
      @outPorts.dimensions.endGroup()

      # Let AsyncComponent know that we're done
      callback null
    image.onerror = (err) ->
      err.url = url

      # Disconnect to let receiving end know we're not going to send
      @outPorts.dimensions.disconnect()

      # Let AsyncComponent know that the operation failed
      return callback err

    # Start the operation
    image.src = url

exports.getComponent = -> new Measure
```

### Important considerations

* There is no need to do a `disconnect` in normal AsyncComponent operation. AsyncComponent will send the disconnect packet after you're done based on where it received one
* AsyncComponent will pass surrounding groups for the packet you're processing automatically, but you can add more as needed
* Call the AsyncComponent callback function after you've completed the operation and sent your output
* For operations that can take a long time it is a good idea to call `connect` on your outport before starting the operation, so that downstream component knows data will be coming
