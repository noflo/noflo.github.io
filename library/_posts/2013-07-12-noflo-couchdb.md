---
  title: "noflo-couchdb"
  description: "CouchDB components for the NoFlo flow-based programming environment"
  author: 
    name: "Henri Bergius"
    email: "henri.bergius@iki.fi"
    avatar: "http://www.gravatar.com/avatar/995f27ce7205a79c55d4e44223cd6de0?s=23"
  version: "1.0.0"
  repository: 
    type: "git"
    url: "https://github.com/noflo/noflo-couchdb.git"
  layout: "library"

---
CouchDB components for NoFlo [![Build Status](https://secure.travis-ci.org/noflo/noflo-couchdb.png?branch=master)](https://travis-ci.org/noflo/noflo-couchdb)
=========================

This module provides CouchDB components for the [NoFlo](http://noflojs.org/) flow-based programming framework

Read a document example flow
----------------------------
Here is an example FBP flow configuration to read a document from a database.  You can put this flow configuration into a file called 'readdoc.fbp' and then run it on the command line with `noflo readdoc.fbp`

    'https://username:password@server.cloudant.com/my-database-name' -> DocReader(couchdb/ReadDocument)
    DocReader() OUT -> IN ConsoleLogger(Output)
    DocReader() LOG -> IN ConsoleLogger(Output)
    'your_couchdb_document_id_here' -> IN DocReader(couchdb/ReadDocument)

In this example I instantiated 2 components which I have called DocReader and ConsoleLogger.  DocReader will run an instance of the couchdb/ReadDocument component (which is defined in this package) and the ConsoleLogger which is defined in the main [NoFlo](http://noflojs.org/) package.

To begin with, I send a message on the DocReader component's URL port telling it where to find the CouchDB database I want to read from.  Then I send the document ID that I want to read from the database to the DocReader component.  The DocReader component will create a CouchDB connection and then when it receives the document ID on the IN port, it will try to read the document I have asked for from CouchDB and send the document to the ConsoleLogger which will print the document out for us to see.

Write a document example flow
-----------------------------
    'https://username:password@server.cloudant.com/my-database-name' -> URL  DocWriter(couchdb/WriteDocument)
    DocWriter() OUT -> IN ConsoleLogger(Output)
    DocWriter() LOG -> IN ConsoleLogger(Output)
    Txt2Obj() OUT -> IN DocWriter(couchdb/WriteDocument)
    '{ "source": "from NoFlo", "how_awesome": "Really rather good." }' -> IN Txt2Obj(ParseJson)

There are 3 components in this example.  Like the document reading example above, I send the URL of the database to a WriteDocument component which I have called DocWriter in this flow.  The DocWriter likes to work with JavaScript objects but I can only write text strings in this flow document.  For the purposes of this demo, I parse the input string into a Javascript object before sending it to the document writer, which will send the document object on to CouchDB.  The component I called Txt2Obj in this flow uses the ParseJson component that is defined in the main [NoFlo](http://noflojs.org/) package.

Read an attachment example flow
-------------------------------
    'https://username:password@server.cloudant.com/my-database-name' -> URL AttReader(couchdb/ReadDocumentAttachment)
    AttReader() OUT -> IN ConsoleLogger(Output)
    AttReader() LOG -> IN ConsoleLogger(Output)
    '{ "id": "your_couchdb_document_id_here", "attachmentName": "rabbit.jpg" }' -> IN Txt2Obj(ParseJson)
    Txt2Obj() OUT -> IN AttReader(couchdb/ReadDocumentAttachment)

There are 3 components in this example.  Like the document writing example above, I send the URL of the database to the AttReader component to tell it which database to look up attachments in.  The AttReader component accepts object requests that must include a docID and attachmentName so I parse the request with the Txt2Obj component before sending the request to the AttReader.  When the attachment has been read it will be send to the ConsoleLogger component.  You should see something like the following output:

    { id: 'blah',
      attachmentName: 'rabbit.jpg',
      data: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 c4 00 00 00 a2 08 02 00 00 00 50 e7 2a bb 00 00 02 11 69 43 43 50 49 43 43 20 50 72 6f 66 69 6c ...>
      header:
       { etag: '"4-f26e2da8d6d0552a8e11a42bdf1d891d"',
         date: 'Fri, 12 Apr 2013 13:20:25 GMT',
         'content-type': 'image/png',
         'content-md5': '/2Ys/O5zAiFTMR6vUcariA==',
         'cache-control': 'must-revalidate',
         'accept-ranges': 'bytes',
         'status-code': 200,
         uri: 'https://username:pasword@server.cloudant.com/my-database-name/your_couchdb_document_id_here/rabbit.jpg' } }

The AttReader component adds a 'data' key to the request before sending it on to its out port.  The 'data' value will always be a Buffer object containing the data of the attachment.  The ConsoleLogger, in this case, prints the first few bytes of the data in hex and indicates that there is more data not shown with '...'  The HTTP header from CouchDB is also included for information purposes, for example, to see the content-type of the data.

When you create your own flows, perhaps you'll want to write the data out to a file.  You could use the [NoFlo MapProperty component](https://github.com/bergie/noflo/blob/master/src/components/MapProperty.coffee) to change 'attachmentName' to 'filename'; chaining several components together until you use the [NoFlo WriteFile component](https://github.com/bergie/noflo/blob/master/src/components/WriteFile.coffee) to write the data to disk.

Read from a view
----------------
    'https://username:password@server.cloudant.com/my-database-name' -> URL ViewReader(couchdb/ReadViewDocuments)
    ViewReader() OUT -> IN ConsoleLogger(Output)
    ViewReader() LOG -> IN ConsoleLogger(Output)
    # '{ "designDocID": "noflo_tests", "viewName": "testDocs" }' -> IN Txt2Obj(ParseJson)
    # '{ "designDocID": "noflo_tests", "viewName": "testDocs", "params": { "startkey": 2, "endkey": 4 } }' -> IN Txt2Obj(ParseJson)
    '{ "designDocID": "noflo_tests", "viewName": "testDocs", "params": { "keys": [2, 3] } }' -> IN Txt2Obj(ParseJson)
    Txt2Obj(ParseJson) OUT -> IN ViewReader(couchdb/ReadViewDocuments)

The view reader component accepts request objects that must include at least a designDocID and a viewName.  You can optionally specify view parameters in a "params" object.  In the view parameters you can include any view criteria that are acceptable to CouchDB.  In the commented lines in the example above, I show how you can request specific keys or a start and end key.

Watching for Changes in the Database
------------------------------------
	'https://username:password@server.cloudant.com/my-database-name' -> URL ChangeReader(couchdb/GetChanges)
	ChangeReader() OUT -> IN ConsoleLogger(Output)
	ChangeReader() LOG -> IN ConsoleLogger(Output)
	'{ "since": "now" }' -> IN Txt2Obj(ParseJson)
	Txt2Obj(ParseJson) OUT -> FOLLOW ChangeReader(couchdb/GetChanges)

The GetChanges component watches for changes in the database and sends the change information to the OUT port.  In addition to sending this component the database URL, you must send it a configuration document on the FOLLOW port.  The values you can specify on the FOLLOW port are described [here](https://github.com/iriscouch/follow#simple-api-followoptions-callback).  These options include being able to specify the change sequence number to see changes from or the symbolic "now" which I have used in the example above.  You can also specify a filter function in a design document or include the JavaScript code for it in your follow options.

The GetChanges component also has a COMMAND port to which you can send messages if you use this component interactively.  It accepts plain strings saying PAUSE, RESUME or STOP.

Making sure a database exists first
-----------------------------------
In previous versions of this library there was an OpenDatabase component which would create a database if it did not exist, then pass a connection object on to the other components which might read or write documents and attachments.  The CreateDatabaseIfNoneExists component replaces the OpenDatabase component.  It has a URL in port and it will check that a database exists before sending the database location on it's URL out port.  You might use it in a flow that looks something like this:

    'https://username:password@server.cloudant.com/my-database-name' -> DbCreate(couchdb/CreateDatabaseIfNoneExists)
	DbCreate() URL -> URL DocReader(couchdb/ReadDocument)
    DocReader() OUT -> IN ConsoleLogger(Output)
    DocReader() LOG -> IN ConsoleLogger(Output)
    'your_couchdb_document_id_here' -> IN DocReader(couchdb/ReadDocument)

This flow is almost the same as the document reading example above, but it makes sure that the CouchDB database exists before passing the URL on to the document reading component.

Logging
-------
Each component in this library includes a 'log' port that describe important events in the components life.  Most importantly, when something goes wrong, the components will write messages with `{ 'logLevel': 'error' }` to the log port.  Each error message will try to describe the context of what the component was doing when the error occurred, a specific problem description as well as suggested solutions.  For example, if I were to misspell the attachment name from the flow immediately above, I would get the following message on the 'log' port.

    { logLevel: 'error',
      context: 'Reading attachment named \'rabbt.jpg\' from document of ID your_couchdb_document_id_here from CouchDB.',
      problem: 'The document was not found.',
      solution: 'Specify the correct document ID and check that another user did not delete the document.',
      when: Fri Apr 12 2013 14:20:12 GMT+0100 (BST),
      source: 'ReadDocumentAttachment',
      nodeID: 'AttReader' }

The 'source' attribute tells you which component generated the message, in case you centralise the error logging.  This might help you determine how to recover from the error and which component to send the corrected request back to.  Why report errors with context, problem & solution?  [I'm glad you asked!](http://programmers.stackexchange.com/questions/29433/how-to-write-a-good-exception-message/29455#29455)
