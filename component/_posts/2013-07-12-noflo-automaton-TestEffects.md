---
  title: "TestEffects"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
_ = require 'underscore'
noflo = require 'noflo'
uuid = require 'uuid'

class TestEffects extends noflo.Component
  constructor: ->
    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
```
When successful

```coffeescript
      out: new noflo.Port 'object'
```
When failing but hasn't reached retry limit

```coffeescript
      retry: new noflo.Port 'object'

    @inPorts.in.on 'data', (context) =>
      offset = context.offset
      rule = context.rules[offset]
      spooky = context.spooky
      selector = rule.selector

```
Offset should only be incremented once per rule

```coffeescript
      incrementOffset = _.once ->
        context.offset++

```
Test each condition

```coffeescript
      _.each rule.conditions, (condition) =>
        params = _.clone condition
        params.selector ?= selector
        params.value ?= null
        params.offset = offset
```
Create a unique ID to capture test output

```coffeescript
        params.uuid = uuid.v1()

```
Figure out how many steps to skip if the condition fails

```coffeescript
        nextName = condition.onFailure
        if nextName?
          nextOffset = @findNext context.rules, offset, nextName
          params.stepsOnFailure = nextOffset - offset

```
Extract the test output as boolean

```coffeescript
        captureTestOutput = (log) =>
          regexp = new RegExp "^\\[checkpoint\\] \\[#{params.uuid}\\] "
          if log.space is 'remote' and log.message.match regexp
```
Get rid of listener

```coffeescript
            spooky.removeListener 'log', captureTestOutput

```
TODO: implement retry
Increment offset if successful as next step will be applied by
the next rule. If it fails, retry

```coffeescript
            if (log.message.replace regexp, '') is 'true'
              incrementOffset()

```
Place listener with `console` because we log in Casper's environment

```coffeescript
        spooky.on 'log', captureTestOutput

```
Add a validation step

```coffeescript
        spooky.then [{ params: JSON.stringify(params) }, ->
          {
            value
            property
            selector
            onFailure
            offset
            uuid
            stepsOnFailure
          } = JSON.parse params

```
Wait for the specified selector to apply. Then test the condition.

```coffeescript
          @waitForSelector selector, ->
```
Extract an attribute

```coffeescript
            v = if property?
              @getElementAttribute selector, property
```
The contained HTML

```coffeescript
            else if value?
              @getHTML selector
```
Nothing

```coffeescript
            else
              null

```
If `evaluate()` cannot handle it, exit

```coffeescript
            isHandled = @evaluate (uuid, offset, v, value, stepsOnFailure) ->
              isValid = not v? or v is value
              console.log "[checkpoint] [#{uuid}] #{isValid}"

```
Report if invalid

```coffeescript
              unless isValid
```
Try to skip if there is a name

```coffeescript
                if stepsOnFailure?
```
Hack: see TestActions on `bypass()`

```coffeescript
                  window._bypass ?= 0
                  window._bypass += stepsOnFailure
                  return true

```
Output error otherwise

```coffeescript
                else
                  output =
                    message: 'condition invalid'
                    offset: offset
                    expected: value
                    actual: v
                  console.log "[output] #{JSON.stringify output}"
```
Exit

```coffeescript
                  return false

```
Assume that we've handled it

```coffeescript
              true
            , uuid, offset, v, value, stepsOnFailure

```
Quit if unhandled

```coffeescript
            @exit() unless isHandled

          , ->
```
Not valid if timed out

```coffeescript
            @evaluate (uuid) ->
              console.log "[checkpoint] [#{uuid}] false"
            , uuid

```
Report failing post-condition

```coffeescript
            isValid = @evaluate (offset, selector, value, stepsOnFailure) ->
```
Skip some steps

```coffeescript
              if stepsOnFailure?
```
Hack: see TestActions on `bypass()`

```coffeescript
                window._bypass ?= 0
                window._bypass += stepsOnFailure
                return true
```
Output and exit otherwise

```coffeescript
              else
                output =
                  message: 'condition selector does not exist'
                  offset:  offset
                  selector: selector
                output.value = value if value?
                console.log "[output] #{JSON.stringify output}"
            , offset, selector, value, stepsOnFailure

```
Do not proceed

```coffeescript
            @exit() unless isValid
        ]

```
Pass onto the next rule

```coffeescript
      @outPorts.out.send context

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

```
Helper to find the next rule by name from current position

```coffeescript
  findNext: (rules, offset, name) ->
    while offset < rules.length
      rule = rules[offset]

      if name is rule.name
        return offset
      else
        offset++

exports.getComponent = -> new TestEffects

```