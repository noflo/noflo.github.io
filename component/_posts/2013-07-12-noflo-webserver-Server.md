---
  title: "Server"
  library: "noflo-webserver"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
http = require "http"
uuid = require "node-uuid"

class Server extends noflo.Component
  description: "This component receives a port and host, and initializes
a HTTP server for that combination. It sends out a request/response pair
for each HTTP request it receives"

  constructor: ->
    @servers = {}
    @inPorts =
      listen: new noflo.Port 'int'
      close: new noflo.Port 'int'
    @outPorts =
      request: new noflo.Port 'object'
      listening: new noflo.Port 'int'
      error: new noflo.Port 'object'

    @inPorts.listen.on "data", (data) =>
      @createServer data

    @inPorts.close.on 'data', (data) =>
      return unless @servers[data]
      @servers[data].close()

  createServer: (port) ->
    server = new http.Server

```
Handle new requests

```coffeescript
    server.on 'request', (req, res) =>
      @sendRequest req, res, port

```
Handle server being closed

```coffeescript
    server.on 'close', =>
      delete @servers[port]
```
No more requests to send as the server has closed

```coffeescript
      @outPorts.request.disconnect()
      return unless @outPorts.listening.isAttached()
```
We've also stopped listening to the port

```coffeescript
      @outPorts.listening.disconnect()

```
Start listening at the designated ports

```coffeescript
    server.listen port, (err) =>
```
Report port binding error

```coffeescript
      if err
        unless @outPorts.error.isAttached()
          throw err
        @outPorts.error.send err
        @outPorts.error.disconnect()
        return
```
Register the server to the component instance

```coffeescript
      @servers[port] = server
```
Connect the request port, as we will have HTTP requests coming through

```coffeescript
      @outPorts.request.connect()
      return unless @outPorts.listening.isAttached()
```
Report that we're listening

```coffeescript
      @outPorts.listening.send port

  sendRequest: (req, res, port) =>
```
Group requests by port number

```coffeescript
    @outPorts.request.beginGroup port
```
All request/response pairs are coupled with a UUID group so they
can be merged back together for writing the response later.

```coffeescript
    @outPorts.request.beginGroup uuid()
    @outPorts.request.send
      req: req
      res: res
    @outPorts.request.endGroup()
    @outPorts.request.endGroup()

exports.getComponent = -> new Server

```