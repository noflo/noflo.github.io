---
layout: documentation
title: Process API
---

The main idea behind process api is having all port stuff come into one place, and all of the outputs sent out from the same place.

The way the process api works is it gets called for each event.
If `done` does not get called, it keeps getting called, and the IPs that are passed to it keep getting appended to the buffer.

<div class="note">
component.process returns instance of component
</div>

-----------------------------
### Index
- [Information Packets](#ips)
- [Component States](#component-states)
  - [Preconditions](#preconditions)
  - [Processing](#processing)
    - [Getting](#getting)
    - [Sending](#sending)
  - [Done](#done)
  - [Stream Helpers](#stream-helpers)
- [Firing Patterns](#firing-patterns)
  - [Full Stream](#full-stream)
  - [Per Packet](#per-packet)
- [Scope](#scope)
- [Buffer](#buffer)
- [Brackets](#brackets)
- [BracketForwarding](#bracket-forwarding)

----------

# <a id="ips"></a> Information Packets (IPs)
- Valid types: 'data', 'openBracket', 'closeBracket'
- can be created using `noflo.IP`
  - `new noflo.IP 'validType', 'data here'`
  - `new noflo.IP 'data', 'canada', scope: 42, index: 2, clonable: true, owner: 'eh', groups: []`
- can check if an object is an IP by using `noflo.IP.isIP(obj)`

----------













# <a id="component-states"></a> Component States

----------------------------------------

## <a id="preconditions"></a> Preconditions

this will check if it has a packet

```coffeescript
input.has 'portname'
```

using multiple arguments will check they all have packets

```coffeescript
input.has 'portname', 'secondportname'
```

one thing to note about input.has is that it will check for any packet type (openBracket, data, closeBracket) so when we just want the data for example, we can filter the data using a callback.

```coffeescript
hasHoldData = input.has 'hold', (ip) -> ip.type is 'data'
```

----------------------------------------

## <a name="processing"></a>Processing

<div class="note">
using `input.get` and `input.getData` will remove the item retreived using it from the buffer.
</div>

## <a name="getting"></a>Getting

### Get <a name="get"></a>
`input.get` will get the IP for that port. When the first IP is openBracket, it will get the date from that, if the first IP is data, it will get the data from that.

Since it removes it from the buffer each time, you can repeatedly call it until you have what you need, for example:

```coffeescript
data = input.get 'in'
until data.type is 'data'
  data.get 'in'
```

### GetData <a name="get-data"></a>
If the port name is not passed in as an argument, it will try to retrieve from the `in` In Port. Meaning, `input.getData` is the same as `input.getData 'in'`

<div class="note">
when you `input.get|getData` from a `control` port, it does not reset the `control` ports buffer because the data is meant to persist until new data is sent to that `control` port. `control` ports also only accept `data` ips. If it is sent bracket `IP`s, they will be dropped silently.
</div>

- `input.getData` will accept port(s) as the parameter.
- `input.getData` is a shortcut for `input.get(portname).data`
Passing in one port will give the data

```coffeescript
data = input.getData portname
```

Passing in multiple ports will give an array of the data (using [destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment))

```coffeescript
[canada, eh] = input.getData 'canada', 'eh'
```

## <a name="sending"></a>Sending

If you're taking something and `send`ing multiple things, you should bracketize it (wrap with an `openBracket` and `closeBracket`)

```coffeescript
output.send new noflo.IP 'openBracket'
for data in ['eh', 'igloo']
  output.send out: data
output.send new noflo.IP 'closeBracket'
output.done()
```

If you're just sending one packet out of one port, it is usually best to use the shortcut for `output.send` and `output.done`, `output.sendDone`

```coffeescript
output.sendDone out: 'data'
```

----------------------------------------
## <a name="done">Done</a>

When you are done processing your data, call `output.done()` (or `output.sendDone` if it makes sense for how you're using it.)

<div class="note">
An Error can be send to `output.sendDone` or `output.done` which will send the Error to the `error` port. If there is not an `error` port defined, it will propogate back up, the same happens if you just throw an Error. `output.sendDone new Error('we have a problem')` In the future, it may emit a proccesserror.
</div>




















----------------------------------------


# <a name="Brackets"></a>Brackets
### Brackets are used to group things.

## <a name="BracketForwarding"></a>BracketForwarding
[animation]()

<div class="note">
Brackets are automatically forwarded from 'in' inPort to outPorts 'out' and 'error' (if those ports exist).
</div>

Bracket forwarding is a way to pass on brackets so that you don't have to deal with brackets coming from that in port in the process function.

If an inport receives an `openBracket`, `data`, and `closeBracket` and you are using `bracketForwarding`, you can get the `data`, process it and send stuff out, and what you send out will be wrapped in the `openBracket` and `closeBracket`.

<div class="note">
Control ports are not wrapped with brackets, they only deal with data.
</div>

An example of bracket forwarding can be found in [Loading Components inline](/documentation/testing/#loading-components-inline)

-----------------------------------------------------

# <a id="stream-helpers"></a>Stream Helpers
- `input.hasStream portname` will check if it has the full stream.
- `input.getStream portname` will get the full stream, then reset the buffer state for that port.

-----------------------------------------------------
# <a id="firing-patterns"></a> Firing Patterns
## There are two standard firing patterns

#### this is data being sent to a port in order.
```
1) openBracket
2) data
3) data
4) closeBracket
```
#### sometimes there is no `openBracket` or `closeBracket` and there is only `data`
```
1) data
```


# <a id="full-stream"></a> Full Stream

```
# get everything from here...
1) openBracket
2) data
3) data
4) closeBracket
# ...to here
```
#### or if there is no wrapping brackets
```
# get everything from here...
1) data
# ...to here
```
### example
```coffeescript
  exports.getComponent = ->
    c = new noflo.Component
      icon: 'gear'
      inPorts:
        eh:
          datatype: 'all'
          required: true
      outPorts:
        canada:
          datatype: 'object'
          required: true
      process: (input, output) ->
        return unless input.hasStream 'in'
        stream = input.getStream 'in'
        # ...do stuff with the stream...
        output.sendDone canada: stream
```


# <a id="per-packet"></a>Per Packet
```xml
1) openBracket # don't get this
2) data # get only this
3) data # and then only this
4) closeBracket # don't get this
```

#### example
```coffeescript
exports.getComponent = ->
  c = new noflo.Component
    icon: 'gear'
    inPorts:
      eh:
        datatype: 'all'
        required: true
    outPorts:
      canada:
        datatype: 'object'
        required: true
    process: (input, output) ->
      return unless input.has 'in', (ip) -> ip.type is 'data'
      data = input.getData 'in'
      # ...do stuff with the data...
      output.send canada: data
```


---------------------
# <a id="scope"></a>Scope
## Use scopes for concurrency.

<div class="note">
Every IP has a scope, it is null by default.
</div>

```coffeescript
c.process (input, output) ->
  data = input.get 'in'
  console.log data.scope
```

If you need to access the scope of the latest bracket being sent in:

```coffeescript
c.process (input, output) ->
  console.log input.scope
```

When you have to set state and cannot keep things in the buffer, assign properties to use scoped indexes, and dont forget to reset the state when required.

```coffeescript
c.example = {}

c.process (input, output) ->
  return unless input.ip.type is 'data'
  data = input.get 'in'
  c.example[data.scope] = data.data
  output.done()

  if true
    delete c.example[data.scope]
```





----------------------------------------
# Buffer <a name="buffer"></a>

If you need to do something advanced and the [Get](#Get) and [Stream](#Stream) helpers cannot do what you need, you can read information right from the buffer. To do that easily, there are `input.buffer` helpers.

<div class="note">
When you manually read from the buffer, it is not reset automatically, so you have to manually change the buffer when you are [finished processing and are done](#Done).
</div>

#### To get the current buffer
```coffeescript
currentBuffer = input.buffer.get()
```

#### To get the current buffer for a specific port
```coffeescript
currentInBuffer = input.buffer.get 'in'
```

#### To find IPs matching criteria for a certain port
```coffeescript
openBracketAndDataForIn = input.buffer.find 'in', (ip) ->
  (ip.type is 'data' or ip.type is 'openbracket') and ip.data?
```

#### To completely reset the buffer
```coffeescript
input.buffer.set portname, []
```

#### or based on your conditions (in this case, removing only ips with data type)
```coffeescript
input.buffer.filter portname, (ip) -> ip.type is 'data'
```

An example usage would be to not reset one port buffer while you reset different one and trigger on every IP.

```coffeescript
noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
    icon: 'gear'
    inPorts:
      eh:
        datatype: 'all'
        required: true
      igloo:
        datatype: 'all'
    outPorts:
      canada:
        datatype: 'object'
    process: (input, output) ->
      return unless input.hasStream 'eh'
      stream = input.getStream 'eh'
      streamData = stream.filter (ip) -> ip.type is 'data'

      data = 'ehs=' + streamData.length
      if input.has 'igloo'
        igloos = input.buffer.find 'igloo', (ip) -> ip.type is 'data'
        for igloo in igloos
          data += '&' + igloo.data

      console.log data
      output.sendDone canada: data

c = exports.getComponent()
eh = new noflo.internalSocket.createSocket()
igloo = new noflo.internalSocket.createSocket()
c.inPorts.eh.attach eh
c.inPorts.igloo.attach igloo

eh.send new noflo.IP 'openBracket'
eh.send 'eh?'
eh.send 'eh!'
eh.send 'eh!?'
igloo.send 'cold'
igloo.send 'message'
eh.send 'eh'
eh.send new noflo.IP 'closeBracket'

# @TODO: NEEDS A FIX
eh.send new noflo.IP 'closeBracket'

eh.send new noflo.IP 'openBracket'
eh.send '...eh...'
eh.send new noflo.IP 'closeBracket'

# @TODO: NEEDS A FIX
eh.send new noflo.IP 'closeBracket'
```
