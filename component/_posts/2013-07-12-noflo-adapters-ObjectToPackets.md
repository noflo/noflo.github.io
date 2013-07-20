---
  title: "ObjectToPackets"
  library: "noflo-adapters"
  layout: "component"

---

    _ = require "underscore"
    noflo = require "noflo"
    owl = require "owl-deepcopy"
    
    class ObjectToPackets extends noflo.Component
    
      description: "Convert each incoming object into grouped packets"
    
      constructor: ->
        @depth = Infinity
    
        @inPorts =
          in: new noflo.Port
          depth: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.depth.on "data", (@depth) =>
    
        @inPorts.in.on "begingroup", (group) =>
          @outPorts.out.beginGroup group
    
        @inPorts.in.on "data", (object) =>

Deep copy because conversation is destructive

          @convert owl.deepCopy(object), @depth
    
        @inPorts.in.on "endgroup", (group) =>
          @outPorts.out.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
    
      convert: (object, level) ->

Deal with data packets

        if _.isArray object
          for datum, i in object
            @outPorts.out.send datum
            delete object[i]

Clean up after deltion

          object = _.compact object
    

Stop if we've reached deep enough

        if level <= 0
          @outPorts.out.send object unless _.isEmpty object
          return
    

Go through the groups

        for key, value of object
          @outPorts.out.beginGroup key
    
          if _.isObject value
            @convert value, level - 1
          else
            @outPorts.out.send value
    
          @outPorts.out.endGroup()
    
    exports.getComponent = -> new ObjectToPackets
    
