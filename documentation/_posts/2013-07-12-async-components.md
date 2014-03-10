---
layout: documentation
title: Async Components
---

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
    image.onload = () =>
      if (image.naturalWidth? and image.naturalWidth is 0) or image.width is 0
        image.onerror new Error "#{url} didn't come back as a valid image."
        return
      dimensions = [image.width, image.height]
      @outPorts.dimensions.beginGroup url
      @outPorts.dimensions.send dimensions
      @outPorts.dimensions.endGroup()
      @outPorts.dimensions.disconnect()
      callback null
    image.onerror = (err) ->
      err.url = url
      return callback err
    image.src = url

exports.getComponent = -> new Measure
```
