---
  title: "GetEmbed"
  library: "noflo-oembed"
  layout: "component"

---

    noflo = require 'noflo'
    oembed = require 'oembed'
    
    class GetEmbed extends noflo.AsyncComponent
      constructor: ->
        @token = null
    
        @inPorts =
          in: new noflo.Port
          token: new noflo.Port
        @outPorts =
          out: new noflo.Port
          error: new noflo.Port
    
        @inPorts.token.on 'data', (data) =>
          oembed.EMBEDLY_KEY = data
    
        super()
    
      doAsync: (url, callback) ->
        try
          oembed.fetch url, {}, (err, embed) =>
            return callback err if err
            @outPorts.out.beginGroup url
            @outPorts.out.send embed
            @outPorts.out.endGroup()
            @outPorts.out.disconnect()
            callback()
        catch e
          callback e
    
    exports.getComponent = -> new GetEmbed
    
