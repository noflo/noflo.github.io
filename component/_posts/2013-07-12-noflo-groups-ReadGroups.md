---
  title: "ReadGroups"
  library: "noflo-groups"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'

class ReadGroups extends noflo.Component
  constructor: ->
    @strip = false
    @threshold = Infinity

    @inPorts =
      in: new noflo.ArrayPort
      strip: new noflo.Port
      threshold: new noflo.Port
    @outPorts =
      out: new noflo.Port
      group: new noflo.Port

    @inPorts.threshold.on 'data', (@threshold) =>
    @inPorts.strip.on 'data', (strip) =>
      @strip = strip is 'true'

    @inPorts.in.on 'connect', =>
      @count = 0
      @groups = []

    @inPorts.in.on 'begingroup', (group) =>
      beginGroup = =>
        @groups.push group
        @outPorts.out.beginGroup group

```
Just forward if we're past the threshold

```coffeescript
      if @count >= @threshold
        beginGroup group

```
Otherwise send a copy to port GROUP

```coffeescript
      else
        @outPorts.group.send group
        beginGroup group unless @strip
        @count++

    @inPorts.in.on 'endgroup', (group) =>
      if group is _.last @groups
        @groups.pop()
        @outPorts.out.endGroup()

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()
      @outPorts.group.disconnect()

exports.getComponent = -> new ReadGroups

```