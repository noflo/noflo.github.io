---
  title: "GroupRouter"
  library: "noflo-routers"
  layout: "component"

---

    noflo = require "noflo"
    _ = require "underscore"
    _s = require "underscore.string"
    { CacheStorage } = require "noflo-flow"
    
    class GroupRouter extends noflo.Component
    
      description: _s.clean "routes IPs based on groups, which are matched and
        routed but not removed when forwarding"
    
      constructor: ->
        @routes = []
        @cache = new CacheStorage
        @count = 0
    
        @inPorts =
          in: new noflo.Port
          route: new noflo.ArrayPort
          reset: new noflo.Port

Legacy-compatibility ports

          routes: new noflo.Port
        @outPorts =
          out: new noflo.ArrayPort
          route: new noflo.Port
          missed: new noflo.Port
    
        @inPorts.reset.on "disconnect", =>
          @routes = []
    
        @inPorts.route.on "data", (segments) =>
          if _.isArray segments
            @routes.push _.map segments, (segment) -> new RegExp segment
          else if not _.isObject segments
            @routes.push [new RegExp segments]
          else
            throw new Error
              message: "Route must be array of segments"
              source: segments
    

Legacy-compatibility ports

        @inPorts.routes.on "data", (routes) =>
          if typeof routes is "string"
            @routes = _.map routes.split(","), (route) ->
              _.map route.split(":"), (segment) ->
                new RegExp segment
    
        @inPorts.in.on "connect", (port) =>

Where we are in terms of groups and whether they match

          @breadcrumb = []
          @matchedIndex = null
          @matchedIndexes = []
          @connected = []
          @count++
    
        @inPorts.in.on "begingroup", (group) =>
          if @outPorts.out.isAttached @matchedIndex
            @connect @matchedIndex
            @cache.beginGroup group, @matchedIndex
    
          @breadcrumb.push group
          @matchRoute group, true
    
        @inPorts.in.on "data", (data) =>
          if @outPorts.out.isAttached @matchedIndex
            @connect @matchedIndex
            @cache.send data, @matchedIndex
          else if @outPorts.missed.isAttached()
            @outPorts.missed.send data
    
        @inPorts.in.on "endgroup", (group) =>
          @breadcrumb.pop()
          @matchRoute group
    
          if @outPorts.out.isAttached @matchedIndex
            @cache.endGroup @matchedIndex
    
        @inPorts.in.on "disconnect", =>
          @cache.disconnect index
          @count--
    
          if @outPorts.route.isAttached()
            for index in @matchedIndexes
              @outPorts.route.send @routes[index]
            @outPorts.route.disconnect()
    
          @outPorts.missed.disconnect() if @outPorts.missed.isAttached()
          @flush() if @count is 0
    
      connect: (index) ->
        return if @connected[index]?
        @cache.connect index
        @connected[index] = true
    
      flush: ->
        for index in [0...@outPorts.out.sockets.length]
          @outPorts.out.connect index
          @cache.flushCache @outPorts.out, index, index
          @outPorts.out.disconnect index
        @cache.reset()
    

Re-evaluate whether there is a route match

      matchRoute: (group) ->
        indexes = _.map @routes, (route, index) =>

Doesn't match if breadcrumb is shorter than route's requirement

          return if route.length > @breadcrumb.length
    

Doesn't match if any of the breadcrumb doesn't match that of the route

          for group, step in @breadcrumb
            return unless group.match route[step]
    

Match otherwise

          return index
    
        indexes = _.without indexes, null, undefined
        @matchedIndex = _.first indexes
        @matchedIndexes.push @matchedIndex if @matchedIndex?
    
    exports.getComponent = -> new GroupRouter
    
