---
  title: "PacketsToObject"
  library: "noflo-adapters"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_ = require "underscore"

class PacketsToObject extends noflo.Component

  description: "Convert a structure of grouped packets into an object"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "connect", =>
      @groups = []
      @object = []

    @inPorts.in.on "begingroup", (group) =>
      here = @locate()
      here[group] = []
      @groups.push group

    @inPorts.in.on "data", (data) =>
      here = @locate()
      here.push data

    @inPorts.in.on "endgroup", (group) =>
      @groups.pop()

    @inPorts.in.on "disconnect", =>
      object = @objectify @object

```
If there's no grouping, it should be forwarded as packets

```coffeescript
      if _.isArray object
        @outPorts.out.send packet for packet in object
```
Otherwise, send it as-is

```coffeescript
      else
        @outPorts.out.send object

      @outPorts.out.disconnect()

  locate: ->
    here = @object
    here = here[group] for group in @groups
    here

  objectify: (object) ->
    return object unless _.isObject object
    obj = {}
    length = object.length

```
If it's not a pure object, drop the array portion

```coffeescript
    if _.keys(object).length > length
      for own key, value of object
        unless _.isNumber key
          obj[key] = @objectify value
```
Otherwise, use the array

```coffeescript
    else
      obj = object.slice()

```
Return the objectified object

```coffeescript
    obj

exports.getComponent = -> new PacketsToObject

```