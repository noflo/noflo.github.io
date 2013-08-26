---
  title: "ConvertEncoding"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class ConvertEncoding extends noflo.Component
  description: 'Convert a string or a buffer from one encoding to another.
    Default from UTF-8 to Base64'

  constructor: ->
```
From this encoding...

```coffeescript
    @from = 'utf8'
```
To this encoding

```coffeescript
    @to = 'base64'
```
The work-in-progress string

```coffeescript
    @wip = ''

    @inPorts =
      in: new noflo.Port 'all'
      from: new noflo.Port 'string'
      to: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.from.on 'data', (@from) =>
    @inPorts.to.on 'data', (@to) =>

    @inPorts.in.on 'connect', =>
      @wip = ''

    @inPorts.in.on 'data', (data) =>
      if data instanceof Buffer
        @wip += data.toString @from
      else if typeof data is 'string'
        @wip += new Buffer(data, @from).toString()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.send new Buffer(@wip).toString @to
      @outPorts.out.disconnect()

exports.getComponent = -> new ConvertEncoding

```