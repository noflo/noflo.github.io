---
  title: "ReadDocumentAttachment"
  library: "noflo-couchdb"
  layout: "component"

---

    
    noflo = require "noflo"
    { CouchDbComponentBase } = require "../lib/CouchDbComponentBase"
    

Ports:
  In:   URL Inherited from CouchDbComponentBase parent class to receive connection information to CouchDB.
            When a URL is received, the parent constructor will create an @dbConnection for us.
        IN  Created in this class to receive document IDs and attachment names to look up in CouchDB

  Out:  LOG Inherited from LoggingComponent to send log messages for error handling.
        OUT Created in this class to send document attachments that were read from CouchDB.


    class ReadDocumentAttachment extends CouchDbComponentBase
      constructor: ->
        super
        @pendingRequests = []
    
        @inPorts.in = new noflo.Port
        @outPorts.out = new noflo.Port
    
        @inPorts.url.on "data", (data) =>
          if @dbConnection?
            @readAttachment request for request in @pendingRequests
          else
            @sendLog
              logLevel: "error"
              context: "Connecting to the CouchDB database at URL '#{data}'."
              problem: "Parent class CouchDbComponentBase didn't set up a connection."
              solution: "Refer the document with this context information to the software developer."
    
        @inPorts.in.on "data", (requestMessage) =>
          if @dbConnection?
            @readAttachment requestMessage
          else
            @pendingRequests.push requestMessage
    
      readAttachment: (requestMessage) =>
        unless requestMessage.id? and requestMessage.attachmentName?
          return @sendLog
            logLevel: "error"
            context: "Received a request to read and attachment from CouchDB."
            problem: "The request must be a object that includes both a 'id' and an 'attachmentName' field."
            solution: "Fix the format of the request to this component. e.g. { 'id': 'abc123', 'attachmentName': 'rabbit.jpg' }"
    
        @dbConnection.attachment.get requestMessage.id, requestMessage.attachmentName, (err, body, header) =>
          if err?
            @sendLog
              logLevel: "error"
              context: "Reading attachment named '#{requestMessage.attachmentName}' from document of ID #{requestMessage.id} from CouchDB."
              problem: err
              solution: "Specify the correct document ID and check that another user did not delete the document."
          else
            requestMessage.data = body
            requestMessage.header = header
            @outPorts.out.send requestMessage if @outPorts.out.isAttached()
    
    
    
    exports.getComponent = -> new ReadDocumentAttachment
    
