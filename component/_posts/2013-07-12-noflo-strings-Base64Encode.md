---
  title: "Base64Encode"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'

class Base64Encode extends noflo.Component
  description: 'This component receives strings or Buffers and sends them out
  Base64-encoded'

  constructor: ->
    @data = null
    @encodedData = ''

```
This component has only two ports: an input port
and an output port.

```coffeescript
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

```
Initialize an empty string for receiving data
when we get a connection

```coffeescript
    @inPorts.in.on 'connect', =>
      @data = ''

```
Process each incoming IP

```coffeescript
    @inPorts.in.on 'data', (data) =>
```
In case of Buffers we can just encode them
immediately

```coffeescript
      if data instanceof Buffer
        @encodedData += data.toString 'base64'
        return
```
In case of strings we just append to the
existing and encode later

```coffeescript
      @data += data

```
On disconnection we send out all the encoded
data

```coffeescript
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.send @encodeData()
      @outPorts.out.disconnect()
      @data = null
      @encodedData = ''

  encodeData: ->
```
In case of Buffers we already have encoded data
available

```coffeescript
    return @encodedData unless @encodedData is ''
```
In case of strings we need to encode the data
first

```coffeescript
    return new Buffer(@data).toString 'base64'

exports.getComponent = -> new Base64Encode

```