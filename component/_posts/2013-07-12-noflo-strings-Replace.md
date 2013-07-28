---
  title: "Replace"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Replace extends noflo.Component

  description: 'Given a fixed pattern and its replacement, replace all
  occurrences in the incoming template.'

  constructor: ->
    @pattern = null
    @replacement = ''

    @inPorts =
      in: new noflo.Port 'string'
      pattern: new noflo.Port 'string'
      replacement: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'string'

    @inPorts.pattern.on 'data', (data) =>
      @pattern = new RegExp(data, 'g')
    @inPorts.replacement.on 'data', (data) =>
      @replacement = data.replace '\\\\n', "\n"

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on 'data', (data) =>
      string = data
      if @pattern?
        string = "#{data}".replace @pattern, @replacement
      @outPorts.out.send string
    @inPorts.in.on 'endgroup', =>
      @outPorts.out.endGroup()
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Replace

```