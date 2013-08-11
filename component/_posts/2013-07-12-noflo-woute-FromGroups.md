---
  title: "FromGroups"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
querystring = require 'querystring'
_ = require 'underscore'
noflo = require 'noflo'

class FromGroups extends noflo.Component
  constructor: ->
    @parts = ['status', 'headers', 'body', 'request']

    @inPorts =
      in: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'

    @inPorts.in.on 'connect', =>
      @status = 200
      @group = null
      @request = null
      @headers = {}
      @body = ''

    @inPorts.in.on 'disconnect', =>
      @flush()
      @outPorts.out.disconnect()

    @inPorts.in.on 'begingroup', (group) =>
```
Extract relevant parts

```coffeescript
      if @parts.indexOf(group) > -1
        @group = group
```
Otherwise, simply forward

```coffeescript
      else
        @outPorts.out.beginGroup group

    @inPorts.in.on 'endgroup', (group) =>
```
Only close irrelevant groups

```coffeescript
      if group is @group
        @group = null
      else
        @outPorts.out.endGroup group

    @inPorts.in.on 'data', (data) =>
      switch @group
        when 'status'
          @status = data
        when 'headers'
          _.extend @headers, data
        when 'body'
          @body += data
        when 'request'
          @request = data

  flush: ->
    @request.res.writeHead @status, @headers
    @request.res.write @body
    @outPorts.out.send @request

exports.getComponent = -> new FromGroups

```