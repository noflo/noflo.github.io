---
  title: "ReadViewDocuments"
  library: "noflo-couchdb"
  layout: "component"

---

    
    noflo = require "noflo"
    { CouchDbComponentBase } = require "../lib/CouchDbComponentBase"
    

Ports:
  In:   URL Inherited from CouchDbComponentBase parent class to receive connection information to CouchDB.
            When a URL is received, the parent constructor will create an @dbConnection for us.
        IN  Created in this class to receive design document IDs, view name and parameters to look up in CouchDB

  Out:  LOG Inherited from LoggingComponent to send log messages for error handling.
        OUT Created in this class to send view contents that were read from CouchDB.


    class ReadViewDocuments extends CouchDbComponentBase
      constructor: ->
        super
        @pendingRequests = []
    
        @inPorts.in = new noflo.Port()
        @outPorts.out = new noflo.Port()
    
        @inPorts.url.on "data", (data) =>
          if @dbConnection?
            @loadViewObjects doc for doc in @pendingRequests
          else
            @sendLog
              logLevel: "error"
              context: "Connecting to the CouchDB database at URL '#{data}'."
              problem: "Parent class CouchDbComponentBase didn't set up a connection."
              solution: "Refer the document with this context information to the software developer."
    
        @inPorts.in.on "data", (doc) =>
          if @dbConnection
            @loadViewObjects doc
          else
            @pendingRequests.push doc
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
          @outPorts.log.disconnect()
    
      loadViewObjects: (requestMessage) ->
        callback = (err, result) =>
          if err?
            @sendLog
              logLevel: "error"
              context: "Reading design document ID #{requestMessage.designDocID} view named #{requestMessage.viewName} from CouchDB."
              problem: err
              solution: "Specify the correct design document ID and view name and check that you have permission to read from this view."
          else
            @outPorts.out.send result if @outPorts.out.isAttached()
    
        if requestMessage.params?
          @dbConnection.view requestMessage.designDocID, requestMessage.viewName, requestMessage.params, callback
        else
          @dbConnection.view requestMessage.designDocID, requestMessage.viewName, callback
    
    exports.getComponent = -> new ReadViewDocuments
    
