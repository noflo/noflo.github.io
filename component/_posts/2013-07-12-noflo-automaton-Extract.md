---
  title: "Extract"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
_ = require 'underscore'
noflo = require 'noflo'

class Extract extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      { spooky, action } = context

```
Extract

```coffeescript
      if action.action is 'extract'
        _action = _.clone action
        _action.offset = context.offset
        _action.prop = action.property or null

```
Execute in browser space for output

```coffeescript
        spooky.then [_action, ->
          @evaluate (offset, selector, prop) ->
```
Hack: see TestActions on `bypass()`

```coffeescript
            if window._bypass > 0
              window._bypass--
              return

```
Get the text if prop isn't defined

```coffeescript
            elems = $(selector)
            if prop?
              values = elems.map (i, elem) ->
                elem.getAttribute prop
            else
              values = elems.map (i, elem) ->
                elem.innerHTML

```
# Output for capture

```coffeescript
            console.log '[output] ' + JSON.stringify
              message: 'values extracted'
              offset: offset
              selector: selector
              property: prop
              values: values.toArray()

```
Need to use `prop` instead of `property` internally because of some
weird Casper.js peculiarity

```coffeescript
          , offset, selector, prop
        ]

```
Forward otherwise

```coffeescript
      else if @outPorts.out.isAttached()
        @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      if @outPorts.out.isAttached()
        @outPorts.out.disconnect()

exports.getComponent = -> new Extract

```