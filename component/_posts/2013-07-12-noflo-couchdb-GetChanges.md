---
  title: "GetChanges"
  library: "noflo-couchdb"
  layout: "component"

---

```coffeescript

noflo = require "noflo"
{ CouchDbComponentBase } = require "../lib/CouchDbComponentBase"

```
Ports:
  In:   URL     Inherited from CouchDbComponentBase parent class to receive connection information to CouchDB.
                When a URL is received, the parent constructor will create an @dbConnection for us.
        FOLLOW  Created in this class to receive requests to get changes from CouchDB.  The data contents on this
                port must be objects with a query and optional parameters.  The contents of this object are described
                at https://github.com/iriscouch/follow#simple-api-followoptions-callback although only the following
                keys are likely to be useful: 'since', 'filter', 'query_params' and 'headers'
        COMMAND Created in this class to ask it to STOP, PAUSE or RESUME the change feed.  The data contents on this
                port must be a string with one of those words in it.

  Out:  LOG Inherited from LoggingComponent to send log messages for error handling.
        OUT Created in this class to send change documents that were read from CouchDB.


```coffeescript
class GetChanges extends CouchDbComponentBase
  constructor: ->
    super

    @inPorts.follow = new noflo.Port()
    @inPorts.command = new noflo.Port()
    @outPorts.out = new noflo.Port()

```
Add an event listener to the URL in-port that we inherit from CouchDbComponentBase

```coffeescript
    @inPorts.url.on "data", (data) =>
      @startFollowing() if @dbConnection? and @followOptions?

```
Since FOLLOW and URL messages might arrive in any order, check for both the options and connection before starting the feed.

```coffeescript
    @inPorts.follow.on "data", (@followOptions) =>
      @startFollowing() if @dbConnection?

    @inPorts.command.on "data", (message) =>
      switch message.toUpperCase()
        when "STOP" then @stopAndDisconnect()
        when "PAUSE" then @feed.pause()
        when "RESUME" then @feed.resume()
        else @sendLog
          logLevel: "error"
          context: "Processing a message on the command port."
          problem: "Command '#{message}' was not recognised."
          solution: "The only valid commands are STOP, PAUSE or RESUME.  The commands are not case sensitive."

  startFollowing: =>
    @feed = @dbConnection.follow(@followOptions)

    @feed.on "change", (changeMessage) =>
      @outPorts.out.send changeMessage

    @feed.follow()

  stopAndDisconnect: =>
    @feed.stop()
    @outPorts.out.disconnect()
    @outPorts.log.disconnect()

exports.getComponent = -> new GetChanges

```