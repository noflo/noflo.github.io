---
  title: "RestApi"
  library: "noflo-twitter"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
chai = require "chai"
oauth = require "oauth"
querystring = require "querystring"

class RestApi extends noflo.LoggingComponent
  constructor: ->
    super

    @version = require('../package.json').version

    @inPorts =
      in: new noflo.Port()

    @outPorts.out = new noflo.Port()

    @inPorts.in.on "data", (requestDoc) =>
      try
        requestDoc = JSON.parse(requestDoc) if typeof requestDoc is "string"
      catch e
        @sendLog
          logLevel: "error"
          context: "Processing a string message on the IN port."
          problem: "The request document was not valid JSON: " + e
          solution: "The request document must either be an object or can be string with valid JSON content."

        @disconnectAllPorts()
        return

      try
        chai.expect(requestDoc).to.have.deep.property("auth.token")
        chai.expect(requestDoc).to.have.deep.property("auth.tokenSecret")
        chai.expect(requestDoc).to.have.deep.property("auth.consumerKey")
        chai.expect(requestDoc).to.have.deep.property("auth.consumerSecret")
        chai.expect(requestDoc).to.have.property("url")
        chai.expect(requestDoc).to.have.property("method")
        chai.expect(requestDoc).to.have.property("qs")

        @twitterQuery(requestDoc)
      catch e
        @sendLog
          logLevel: "error"
          context: "Processing a message requesting a poll of Twitter information."
          problem: "The request document was missing required information: " + e
          solution: "Check the examples documentation for how to request work from this component."

        @disconnectAllPorts()

  twitterQuery: (requestDoc) =>
    twitter = new oauth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      requestDoc.auth.consumerKey,
      requestDoc.auth.consumerSecret,
      "1.0A", null, "HMAC-SHA1", null,
      { "Accept": "*/*", "Connection": "close", "User-Agent": "noflo-twitter/" + @version} # headers
    )

    switch requestDoc.method.toUpperCase()
      when "GET"
        url = requestDoc.url + "?" + querystring.stringify(requestDoc.qs)
        twitter.get url, requestDoc.auth.token, requestDoc.auth.tokenSecret, @makeTweetParserForRequest(requestDoc)
      when "POST"
        twitter.post requestDoc.url, requestDoc.auth.token, requestDoc.auth.tokenSecret, requestDoc.qs, @makeTweetParserForRequest(requestDoc)
      else
        @sendLog
          logLevel: "error"
          context: "Processing a message requesting a poll of Twitter information."
          problem: "Request method '#{requestDoc.method}' is not supported.  Twitter only uses GET and POST."
          solution: "Check the Twitter API documentation at https://dev.twitter.com/docs/api/1.1 to see which method to use for this call."

    @disconnectAllPorts()

  makeTweetParserForRequest: (requestDoc) =>
    return (error, data, response) =>
      if error
        @sendLog
          logLevel: "error"
          context: "Sending a request to the Twitter REST API."
          problem: error
          solution: "Fix your request or try again later."
      else
        @outPorts.out.beginGroup requestDoc

        try
          @outPorts.out.send tweet for tweet in JSON.parse(data)
        catch parseError
          @sendLog
            logLevel: "error"
            context: "Parsing response from Twitter REST API."
            problem: parseError
            solution: "Refer this error to the developer of noflo-twitter or fix it yourself by forking the github repository."

        @outPorts.out.endGroup()

        @sendLog
          logLevel: "info"
          message: "Twitter REST API call finished successfully."
          request: requestDoc

  disconnectAllPorts: =>
    @outPorts.out.disconnect()
    @outPorts.log.disconnect()

exports.getComponent = -> new RestApi

```