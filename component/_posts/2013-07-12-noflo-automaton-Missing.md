---
  title: "Missing"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
_ = require 'underscore'
noflo = require 'noflo'

class Missing extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky } = context

      params =
        action: JSON.stringify context.action
        offset: context.offset

```
Execute in browser space for output

```coffeescript
      spooky.then [params, ->
        @evaluate (action, offset) ->
          console.log '[output] ' + JSON.stringify
            message: 'action runner missing'
            offset: offset
            action: action
        , (JSON.parse action), offset
      ]

exports.getComponent = -> new Missing

```