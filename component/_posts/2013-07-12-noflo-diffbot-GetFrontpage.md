---
  title: "GetFrontpage"
  library: "noflo-diffbot"
  layout: "component"

---

    noflo = require 'noflo'
    diffbot = require 'diffbot'
    
    class GetFrontpage extends noflo.AsyncComponent
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

Open connection to keep NoFlo process running

        @outPorts.out.connect()
    
        bot = new diffbot.Diffbot @token
        bot.frontpage
          uri: url
          html: true
          stats: true
        , (err, data) =>
          @outPorts.out.disconnect() if err
          return callback err if err
          return callback data if data.statusCode is 401
          return callback data unless data.childNodes.length
          @outPorts.out.beginGroup url
    
          for node in data.childNodes
            @sendArticle node
    
          @outPorts.out.endGroup()
          @outPorts.out.disconnect()
          callback()
    
      sendArticle: (node) ->
        return unless node.tagName is 'item'
    
        article = {}
    
        switch node.type
          when 'STORY' then article.type = 'article'
          when 'LINK' then article.type = 'link'
          when 'IMAGE' then article.type = 'image'
    
        for child in node.childNodes
          if child.childNodes.length is 1
            article[child.tagName] = child.childNodes[0]
          else
            article[child.tagName] = child.childNodes
    
        @outPorts.out.send article
    
    exports.getComponent = -> new GetFrontpage
    
