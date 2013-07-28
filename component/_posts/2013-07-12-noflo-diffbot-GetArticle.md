---
  title: "GetArticle"
  library: "noflo-diffbot"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
diffbot = require 'diffbot'

class GetArticle extends noflo.AsyncComponent
  constructor: ->
    @token = null

    @inPorts =
      in: new noflo.Port
      token: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.token.on 'data', (data) =>
      @token = data

    super()

  doAsync: (url, callback) ->
    bot = new diffbot.Diffbot @token
    bot.article
      uri: url
      html: true
      stats: true
    , (err, article) =>
      return callback err if err
      return callback article if article.errorCode is 401
      @outPorts.out.beginGroup url
      @outPorts.out.send article
      @outPorts.out.endGroup()
      @outPorts.out.disconnect()
      callback()

exports.getComponent = -> new GetArticle

```