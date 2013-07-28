---
  title: "BulkUpdate"
  library: "noflo-couchdb"
  layout: "component"

---

```coffeescript

noflo = require "noflo"
{ CouchDbComponentBase } = require "../lib/CouchDbComponentBase"

```
Ports:
  In:   URL Inherited from CouchDbComponentBase parent class to receive connection information to CouchDB.
            When a URL is received, the parent constructor will create an @dbConnection for us.
        IN  Created in this class to receive bulk update documents to send to CouchDB

  Out:  LOG Inherited from LoggingComponent to send log messages for error handling.
        OUT Created in this class to send documents that were written to CouchDB.


```coffeescript
class BulkUpdate extends CouchDbComponentBase
  constructor: ->
    super
    @request = null
    @pendingRequests = []

    @inPorts.in = new noflo.Port()
    @outPorts.out = new noflo.Port()

    @inPorts.url.on "data", (data) =>
      if @dbConnection?
        @sendBulkUpdate doc for doc in @pendingRequests
      else
        @sendLog
          logLevel: "error"
          context: "Connecting to the CouchDB database at URL '#{data}'."
          problem: "Parent class CouchDbComponentBase didn't set up a connection."
          solution: "Refer the document with this context information to the software developer."

    @inPorts.in.on "data", (doc) =>
      if @dbConnection?
        @sendBulkUpdate doc
      else
        @pendingRequests.push doc
        
    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()
      @outPorts.log.disconnect()

  sendBulkUpdate: (updatesDoc) =>
    unless updatesDoc.docs and updatesDoc.docs instanceof Array
      return @sendLog
        logLevel: "error"
        context: "Received a request to make bulk updates in CouchDB."
        problem: "The request must be a object that includes a 'docs' element that is an array of document changes."
        solution: "Fix the format of the request to this component as per http://wiki.apache.org/couchdb/HTTP_Bulk_Document_API."

    @dbConnection.bulk updatesDoc, (err, response) =>
      if err?
        @sendLog
          logLevel: "error"
          context: "Sending a bulk update document to CouchDB."
          problem: response
          solution: "Resolve all conflicts and check that you have permission to change documents in this database."
      else
        @outPorts.out.send response if @outPorts.out.isAttached()

exports.getComponent = -> new BulkUpdate

```