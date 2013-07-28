---
  title: "GetAvatar"
  library: "noflo-gravatar"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
gravatar = require 'gravatar'

class GetAvatar extends noflo.Component
  constructor: ->
    @size = 200
    @inPorts =
      email: new noflo.Port 'string'
      size: new noflo.Port 'int'
    @outPorts =
      avatar: new noflo.Port 'string'

    @inPorts.size.on 'data', (data) =>
      @size = data

    @inPorts.email.on 'begingroup', (group) =>
      @outPorts.avatar.beginGroup group
    @inPorts.email.on 'data', (email) =>
      avatar = gravatar.url email,
        s: @size
      @outPorts.avatar.send avatar
    @inPorts.email.on 'endgroup', (group) =>
      @outPorts.avatar.endGroup
    @inPorts.email.on 'disconnect', (group) =>
      @outPorts.avatar.disconnect()

exports.getComponent = -> new GetAvatar

```