---
  title: "TestActions"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'
uuid = require 'uuid'

class TestActions extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'object'
    @outPorts =
      out: new noflo.Port 'object'
      action: new noflo.ArrayPort 'object'

    @inPorts.in.on 'data', (context) =>
      offset = context.offset
      rule = context.rules[offset]
      spooky = context.spooky

```
Go through each action and send as individual packet

```coffeescript
      _.each rule.actions, (action) =>
        _action = _.clone action
```
Use rule's selector by default

```coffeescript
        _action.selector ?= rule.selector

```
Default for expected parameters

```coffeescript
        params = _.clone _action
        params.value ?= null
        params.offset = offset

```
Create a unique ID to capture test output

```coffeescript
        params.uuid = uuid.v1()

```
Extract the test output as boolean

```coffeescript
        captureTestOutput = (log) ->
          regexp = new RegExp "^\\[checkpoint\\] \\[#{params.uuid}\\] "
          if log.match regexp
```
Get rid of listener

```coffeescript
            spooky.removeListener 'console', captureTestOutput

```
Place listener with `console` because we log in Casper's environment

```coffeescript
        spooky.on 'console', captureTestOutput

```
Test the selector

```coffeescript
        spooky.then [params, ->
```
Don't do anything if it passes as it implicitly moves to the next
step. Otherwise, bypass the action.

```coffeescript
          @waitForSelector selector, (->), ->
            console.log "[checkpoint] [#{uuid}] false"

```
Report failing action precondition

```coffeescript
            @evaluate (offset, selector, value) ->
              output =
                message: 'action selector does not exist'
                offset:  offset
                selector: selector
              output.value = value if value?
              console.log "[output] #{JSON.stringify output}"

```
Make action aware not to execute if it's invalid. When 1.1
becomes stable and SpookyJS supports that, we can use
`bypass()`.

```coffeescript
              window._bypass ?= 0
              window._bypass++
            , offset, selector, value

```
This should be used instead of the hack above when 1.1 is supported
@bypass 1

```coffeescript
        ]

```
Do the action

```coffeescript
        @outPorts.action.send
          spooky: spooky
          action: _action
          offset: offset

```
THEN, set the number of actions and forward context object to OUT

```coffeescript
      context.counts.actions = rule.actions.length
      @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      @outPorts.action.disconnect()
      @outPorts.out.disconnect()

exports.getComponent = -> new TestActions

```