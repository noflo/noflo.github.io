---
  title: "MergeObjects"
  library: "noflo-objects"
  layout: "component"

---

```coffeescript
_ = require("underscore")
noflo = require("noflo")

class MergeObjects extends noflo.Component

  description: "merges all incoming objects into one"

  constructor: ->
    @merge = _.bind @merge, this

    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "connect", () =>
      @groups = []
      @objects = []

    @inPorts.in.on "begingroup", (group) =>
      @groups.push(group)

    @inPorts.in.on "data", (object) =>
      @objects.push(object)

    @inPorts.in.on "endgroup", (group) =>
      @groups.pop()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.send _.reduce @objects, @merge, {}
      @outPorts.out.disconnect()

  merge: (origin, object) ->
```
Go through the incoming object

```coffeescript
    for key, value of object
      oValue = origin[key]

```
If property already exists, merge

```coffeescript
      if oValue?
```
... depending on type of the pre-existing property

```coffeescript
        switch toString.call(oValue)
```
Concatenate if an array

```coffeescript
          when "[object Array]"
            origin[key].push.apply(origin[key], value)
```
Merge down if an object

```coffeescript
          when "[object Object]"
            origin[key] = @merge(oValue, value)
```
Replace if simple value

```coffeescript
          else
            origin[key] = value

```
Use object if not

```coffeescript
      else
        origin[key] = value

    origin

exports.getComponent = -> new MergeObjects

```