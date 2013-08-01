---
  title: "Extend"
  library: "noflo-objects"
  layout: "component"

---

```coffeescript
_ = require("underscore")
noflo = require("noflo")

class Extend extends noflo.Component

  description: "Extend an incoming object to some predefined
  objects, optionally by a certain property"

  constructor: ->
    @bases = []
    @key = null

    @inPorts =
      in: new noflo.Port
      base: new noflo.Port
      key: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.base.on "data", (base) =>
      if base?
        @bases.push(base)
      else
        @bases = []

    @inPorts.key.on "data", (@key) =>

    @inPorts.in.on "connect", =>
      @objects = []

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)

    @inPorts.in.on "data", (incoming) =>
      out = {}

      for base in @bases
```
If there is not key defined, simply extend all; or if the key
property matches, merge them as well

```coffeescript
        if not @key? or
           incoming[@key]? and
           incoming[@key] is base[@key]
          _.extend(out, base)

```
Put on incoming

```coffeescript
      _.extend(out, incoming)

      @outPorts.out.send(out)

    @inPorts.in.on "endgroup", (group) =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

```
Clean a string of symbols

```coffeescript
cleanSymbols = (str) ->
  str.replace(/[^a-zA-Z0-9]/g, "")

exports.getComponent = -> new Extend

```