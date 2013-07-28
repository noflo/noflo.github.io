---
  title: "CountDown"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_s = require("underscore.string")

class CountDown extends noflo.Component

  description: _s.clean "count down from particular number, by default 1, and
    send an empty IP when it hits 0"

  constructor: ->
    @default = @count = 1
    @repeat = true

    @inPorts =
      in: new noflo.Port
      count: new noflo.Port
      repeat: new noflo.Port
    @outPorts =
      out: new noflo.Port
      count: new noflo.Port

    @inPorts.count.on "data", (@count) =>
      @default = @count

    @inPorts.repeat.on "data", (@repeat) =>
      @default = null unless @repeat

    @inPorts.in.on "disconnect", =>
      if --@count is 0
        @outPorts.out.send(null)
        @outPorts.out.disconnect()

        @count = @default if @repeat

exports.getComponent = -> new CountDown

```