Move protocol page to a folder so we preserve the url, but doesn't show it in the sidebar

Write about Async
Write about wire pattern


RESTRUCTURE COMPONENT FILE

@TODO: tweet new noflo docs from @noflo

@TODO: lifecycle

WHEN SENDING OPENBRACKET, YOU HAVE TO SEND IT DATA FOR IT TO FIRE WTF


-------

Control portd
Using one inport
Using multiple inports
^ DID IN WIREPATTERN, DO FOR PROCESS API
how to write components
generators? just don't call done keep calling it?

=====

using your own components
using other peoples components

# can use fbp
graphs
subgraphs
tests (use fbp spec first, maybe in another file use mocha)

debugging

something we should make clear is that it is just a js lib and that people can use it in their own projects as a part, or as the entire thing. They don't have to use noflo specific testing tools and can use whatever they want.

use example using it

-----

if you're taking something and `send`ing multiple things, you should bracketize it


!!!!!!



======================================

@TODO: WE NEED TO FIX TRANSLATION OF OPENBRACKET AND CLOSE TO CONNECT & DISCONNECT
@TODO: WE NEED TO FIX GETDATA, GET, AND FORWARDBRACKETS

preconditions | resolves *** flush out with Vladimir ###
processOutputQueue ^
^ LIFECYCLE
^ ENSURE forwarded brackets are actually wrapping the content being sent inside of process. ?~Open before it starts, close when done.


STRICT MODE FOR PORTS


Add automatic port selection for `send` in addition to `sendDone`


inport: validate # flush out
look through component tests to find cool uses





===========================


THIS WAS THE STUFFS DOING KICK...

#@TODO: USE SCOPES HERE
```
c = new noflo.Component
  inPorts:
    hold:
      datatype: 'all'
      required: true
    trigger:
      datatype: 'bang'
      required: true
  outPorts:
    out:
      datatype: 'all'
      required: true

c.hold = null

# when we get data on `hold`, store it to state
c.inPorts.hold.on 'data', (data) ->
  c.hold = data

# when we get data on `trigger`, we send out value we saved in hold
c.inPorts.on 'data', (data) ->
  c.outPorts.out.send c.hold
  c.outPorts.out.disconnect()
```
We can improve this by

the order here matters, since `length` is optional/not-required, if we use `length` we must send `length` before `start` or `string` because our [precondition](#/documentation/process-api/#Precondition) waits only for `start` or `string`.
```coffeescript
c = new noflo.Component
  inPorts:
    string:
      datatype: 'string'
      required: true
    start:
      datatype: 'int'
      required: true
    length:
      datatype: 'int'
  outPorts:
    out:
      datatype: 'all'
      required: true

c.process (input, output) ->
  return unless input.has 'string', 'start'

  length = null
  if input.has 'length'
    length = input.getData 'length'

  string = input.getData 'string'
  start = input.getData 'start'

  output.sendDone string.substr string, start, length
```






,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
# NOT SURE IF BELOW THIS WILL BE USED...
`````````````````````````````````````

```
  propBuffer = input.ports.property.buffer
  openBracket = (propBuffer.filter (ip) -> ip.type is 'openBracket' and ip.data?)[0]
  propData = (propBuffer.filter (ip) -> ip.type is 'data' and ip.data?)[0]
  closeBracket = (propBuffer.filter (ip) -> ip.type is 'closeBracket' and ip.data?)[0]
  hasData = input.has 'in'

  return unless openBracket? and propData? and closeBracket? and hasData

  data = input.getData 'in'
  key = openBracket.data

  outputData = {}
  if data instanceof Object
    outputData = data

  outputData[key] = propData.data
  output.ports.out.send outputData
```


======================================

1)
```
  _ = require("underscore")
  noflo = require("noflo")

  class MergeObjects extends noflo.Component

    description: "merges all incoming objects into one"

    constructor: ->
      @merge = _.bind @merge, this

      @inPorts = new noflo.InPorts
        in:
          datatype: 'object'
          description: 'Objects to merge (one per IP)'
      @outPorts = new noflo.OutPorts
        out:
          datatype: 'object'
          description: 'A new object containing the merge of input objects'

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
      # Go through the incoming object
      for key, value of object
        oValue = origin[key]

        # If property already exists, merge
        if oValue?
          # ... depending on type of the pre-existing property
          switch toString.call(oValue)
            # Concatenate if an array
            when "[object Array]"
              origin[key].push.apply(origin[key], value)
            # Merge down if an object
            when "[object Object]"
              origin[key] = @merge(oValue, value)
            # Replace if simple value
            else
              origin[key] = value

        # Use object if not
        else
          origin[key] = value

      origin

  exports.getComponent = -> new MergeObjects
```

2)
```
  # use single quotes coffeescript style
  _ = require 'underscore'
  noflo = require 'noflo'

  # remove uneeded binding
  # change from class to a function
  exports.getComponent = ->
    c = new noflo.Component
    c.description = 'merges all incoming objects into one'

    c.inPorts = new noflo.InPorts
      in:
        datatype: 'object'
        description: 'Objects to merge (one per IP)'
    c.outPorts = new noflo.OutPorts
      out:
        datatype: 'object'
        description: 'A new object containing the merge of input objects'

    c.inPorts.in.on "connect", () =>
      c.groups = []
      c.objects = []

    c.inPorts.in.on "begingroup", (group) =>
      c.groups.push(group)

    c.inPorts.in.on "data", (object) =>
      c.objects.push(object)

    c.inPorts.in.on "endgroup", (group) =>
      c.groups.pop()

    c.inPorts.in.on "disconnect", =>
      c.outPorts.out.send _.reduce c.objects, c.merge, {}
      c.outPorts.out.disconnect()

    c.merge = (origin, object) ->
      # Go through the incoming object
      for key, value of object
        oValue = origin[key]

        # If property already exists, merge
        if oValue?
          # ... depending on type of the pre-existing property
          switch toString.call(oValue)
            # Concatenate if an array
            when "[object Array]"
              origin[key].push.apply(origin[key], value)
            # Merge down if an object
            when "[object Object]"
              origin[key] = c.merge(oValue, value)
            # Replace if simple value
            else
              origin[key] = value

        # Use object if not
        else
          origin[key] = value

      origin

    c

```

3)
```
  _ = require 'underscore'
  noflo = require 'noflo'

  # remove state being kept in the component
  exports.getComponent = ->
    c = new noflo.Component
    c.description = 'merges all incoming objects into one'

    c.inPorts = new noflo.InPorts
      in:
        datatype: 'object'
        description: 'Objects to merge (one per IP)'
    c.outPorts = new noflo.OutPorts
      out:
        datatype: 'object'
        description: 'A new object containing the merge of input objects'

    c.merge = (origin, object) ->
      # Go through the incoming object
      for key, value of object
        oValue = origin[key]

        # If property already exists, merge
        if oValue?
          # ... depending on type of the pre-existing property
          switch toString.call(oValue)
            # Concatenate if an array
            when "[object Array]"
              origin[key].push.apply(origin[key], value)
            # Merge down if an object
            when "[object Object]"
              origin[key] = c.merge(oValue, value)
            # Replace if simple value
            else
              origin[key] = value

        # Use object if not
        else
          origin[key] = value

      origin

    # use process
    c.process (input, output) ->
      inData = input.buffer.find 'in', (ip) -> ip.type is 'data' and ip.data?
      return unless inData.length is 2
      output.ports.out.send inData.reduce c.merge, {}
```


x)

```
  noflo = require 'noflo'

  exports.getComponent = ->
    c = new noflo.Component
    c.description = 'merges all incoming objects into one'

    c.inPorts = new noflo.InPorts
      in:
        datatype: 'object'
        description: 'Objects to merge (one per IP)'
    c.outPorts = new noflo.OutPorts
      out:
        datatype: 'object'
        description: 'A new object containing the merge of input objects'

    c.merge = (origin, object) ->
      # Go through the incoming object
      for key, value of object
        oValue = origin[key]

        # If property already exists, merge
        if oValue?
          # ... depending on type of the pre-existing property
          switch toString.call(oValue)
            # Concatenate if an array
            when "[object Array]"
              origin[key].push.apply(origin[key], value)
            # Merge down if an object
            when "[object Object]"
              origin[key] = c.merge(oValue, value)
            # Replace if simple value
            else
              origin[key] = value

        # Use object if not
        else
          origin[key] = value

      origin

    c.process (input, output) ->
      # we want to get
      inData = input.buffer.find 'in', (ip) -> ip.type is 'data' and ip.data?
      return unless inData.length is 2
      output.ports.out.send inData.reduce c.merge, {}
```






`````````````````````````````````````
(Buffers...)####### @TODO: should this be split into processing and finishing, or have its own section (or be with helpers) and then flush out usage separately?
Buffer usage
- make sure to clear the buffer
> main buffer + port buffer, or both?


