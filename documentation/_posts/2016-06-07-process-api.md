---
layout: documentation
title: Process API
---

The main idea behind process api is having all port stuff come into one place, and all of the outputs sent out from the same place.

The way the process api works is it gets called for each event.
If `done` does not get called, it keeps getting called, and the IPs that are passed to it keep getting appended to the buffer.

>
> (did you know / helpful tricks box?) component.process returns instance of component
>

-----------------------------
### Index
- [ComponentStates](#component-states)
  - [Preconditions](#preconditions)
  - [Processing](#processing)
    - [Getting](#getting)
    - [Sending](#sending)
  - [Done](#done)
- [FiringPatterns](#firing-patterns)
  - [FullStream](#full-stream)
  - [PerPacket](#per-packet)
  - [StreamHelpers](#stream-helpers)
- [Ports](#ports)
- [Scope](#scope)
- [Buffer](#buffer)
- [Brackets](#brackets)
- [BracketForwarding](#bracket-forwarding)



=================================================
# <a id="component-statess"></a> Component States

----------------------------------------

# <a id="preconditions"></a> Preconditions

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

# <a name="processing"></a>Processing

>
> (did you know / helpful tricks box?) using `input.get` and `input.getData` will remove the item retreived using it from the buffer.
>

# <a name="getting"></a>Getting

## Get <a name="get"></a>
`input.get` will get the IP for that port. When the first IP is openBracket, it will get the date from that, if the first IP is data, it will get the data from that.

Since it removes it from the buffer each time, you can repeatedly call it until you have what you need, for example:

```coffeescript
data = input.get 'in'
until data.type is 'data'
  data.get 'in'
```

## GetData <a name="get-data"></a>
If the port name is not passed in as an argument, it will try to retrieve from the `in` In Port. Meaning, `input.getData` is the same as `input.getData 'in'`

>
> (did you know / helpful tricks box?) when you `input.get|getData` from a `control` port, it does not reset the `control` ports buffer because the data is meant to persist until new data is sent to that `control` port. `control` ports also only accept `data` ips. If it is sent bracket `IP`s, they will be dropped silently.
>

- `input.getData` will accept port(s) as the parameter.
- `input.getData` is a shortcut for `input.get(portname).data`
Passing in one port will give the data

```coffeescript
data = input.getData portname
```

Passing in multiple ports will give an array of the data

```coffeescript
dataArray = input.getData 'in', 'eh'
```

# <a name="sending"></a>Sending

If you're taking something and `send`ing multiple things, you should bracketize it (wrap with an `openBracket` and `closeBracket`ß)

```coffeescript
output.send new noflo.IP 'openBracket', ''
for data in ['eh', 'igloo']
  output.send out: data
output.send new noflo.IP 'closeBracket', ''
output.done()
```

If you're just sending one packet out of one port, it is usually best to use the shortcut for `output.send` and `output.done`, `output.sendDone`

```coffeescript
output.sendDone out: 'data'
```

----------------------------------------
### <a name="done">Done</a>

When you are done processing your data, call `output.done()` (or `output.sendDone` if it makes sense for how you're using it.)

>
> (did you know / helpful tricks box?) An Error can be send to `output.sendDone` or `output.done` which will send the Error to the `error` port. If there is not an `error` port defined, it will propogate back up, the same happens if you just throw an Error. @todo: EMMITS PROCESSERROR event `output.sendDone new Error('we have a problem')`
>
=================================================



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
<bracket> # connect
  <data> # get only this
  <data> # and then only this
</bracket> # disconnect
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
# <a id="scope"></a>scope
## Use scopes for concurrency.

> Every IP has a scope, it is null by default.

```coffeescript
c.process (input, output) ->
  data = input.get 'in'
  console.log data.scope
```

If you need to access the scope of the latest bracket being sent in
```coffeescript
c.process (input, output) ->
  console.log input.scope
```

When you have to set state and cannot keep things in the buffer assign variables or properties to use scoped indexes, and dont forget to reset the state when required.

```coffeescript
c.example = {}

c.process (input, output) ->
  return unless input.ip.type is 'data'
  data = input.get 'in'
  c.example[data.scope] = data.data
  input.done()

  if true
    delete c.example[data.scope]
```





----------------------------------------
# Buffer <a name="buffer"></a>

If you need to do something advanced and the [Get](#Get) and [Stream](#Stream) helpers cannot do what you need, you can read information right from the buffer. To do that easily, there are `input.buffer` helpers.

>
> (did you know / helpful tricks box?) When you manually read from the buffer, it is not reset automatically, so you have to manually change the buffer when you are [finished processing and are done](#Done).
>

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

        output = 'ehs=' + streamData.length
        if input.has 'igloo'
          igloos = input.buffer.find 'igloo', (ip) -> ip.type is 'data'
          for igloo in igloos
            output += '&' + igloo.data

        output.sendDone canada: output

    # /////
    eh.connect()
    eh.send 'eh?'
    eh.send 'eh!'
    eh.send 'eh!?'
    igloo.send 'cold'
    igloo.send 'message'
    eh.send 'eh'
    eh.disconnect()
    eh.connect()
    eh.send '...eh...'
    eh.disconnect()
```

----------------------------------------


# <a name="Brackets">Brackets</a>
### Brackets are used to group things.

Say you were using a database query, querying a list of names from people
#### @TODO: this would also be one component connected to another so a graph example could be used or attach manually
```coffeescript
  noflo = require 'noflo'
  fetchPeople = ->
    component = new noflo.Component
      inPorts:
        requestid:
          type: 'string'
        amount:
          type: 'int'
          description: 'amount of people to fetch'
      outPorts:
        out:
          datatype: 'object'
          description: 'bracket collection of people selected'
      process: (input, output) ->
        requestid = input.getData 'requestid'
        output.send out: new noflo.IP 'openBracket', requestid

        # imaginarily fetching from a db, could send db connection in through a port
        result = ['john', 'sue']
        for data in result
          output.send out: data

        output.send out: new noflo.IP 'closeBracket', requestid

  log = ->
    component = new noflo.Component
      inPorts:
        in:
          type: 'all'
          description: 'data to log'
    c.process (input, output) ->
      return unless input.hasStream 'in'
      console.log input.getStream 'in'
      output.done()


  # @TODO: connect getPeople and log and test eh
```



## <a name="BracketForwarding">BracketForwarding</a>
Bracket forwarding is a way to pass on brackets so that you don't have to deal with brackets coming from that in port in the process function. If an inport receives an `openBracket`, `data`, and `closeBracket` and you are using `bracketForwarding`, you can get the `data`, process it and send stuff out, and what you send out will be wrapped in the `openBracket` and `closeBracket`.
Brackets are automatically forwarded from 'in' inPort to outPorts 'out' and 'error' (if they exist).


```coffeescript
  noflo = require 'noflo'
  fetchPeople = ->
    component = new noflo.Component
      inPorts:
        eh:
          datatype: 'all'
      outPorts:
        out:
          datatype: 'object'
          description: 'random data'
        error:
          datatype: 'object'
          description: 'if something goes horribly wrong'
      c.forwardBrackets
        eh: ['out', 'error']
      process: (input, output) ->
        eh = input.getData 'eh'
        output.send out: new noflo.IP 'openBracket'
        output.send out: eh
        output.send out: new noflo.IP 'closeBracket'

  log = ->
    component = new noflo.Component
      inPorts:
        in:
          type: 'all'
          description: 'data to log'

    # we don't want to automatically forward from `in` so we set it to empty
    c.forwardBrackets = {}
    c.process (input, output) ->
      # the stream will contain all the forwarded openBrackets
      console.log input.getStream 'in'
      output.done()


  Log.attach LogIn
  FetchPeopleOut.attach.LogIn

  # will be openBracket, data, closeBracket
  # and those will be forwarded to Log in port
  # which will wrap the brackets that FetchPeople itself sends
  FetchPeopleEh.connect()
  FetchPeopleEh.send 'message'
  FetchPeopleEh.disconnect()

  # @TODO: connect getPeople and log and test eh
```