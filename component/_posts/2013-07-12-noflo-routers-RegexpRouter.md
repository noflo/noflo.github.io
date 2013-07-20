---
  title: "RegexpRouter"
  library: "noflo-routers"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    _s = require("underscore.string")
    
    class RegexpRouter extends noflo.Component
    
      description: _s.clean "Route IPs based on RegExp (top-level only). The
      position of the RegExp determines which port to forward to."
    
      constructor: ->
        @routes = []
    
        @inPorts =
          in: new noflo.Port
          route: new noflo.ArrayPort
          reset: new noflo.Port
        @outPorts =
          out: new noflo.ArrayPort
          missed: new noflo.Port
          route: new noflo.Port
    
        @inPorts.reset.on "disconnect", =>
          @routes = []
    
        @inPorts.route.on "data", (regexp) =>
          if _.isString(regexp)
            @routes.push new RegExp regexp
          else
            throw new Error
              message: "Route must be a string"
              source: regexp
    
        @inPorts.in.on "connect", =>

Is there currently a match? If so, what's the route to forward to?

          @matchedRouteIndex = null

How deep are we in the group hierarchy?

          @level = 0
    
        @inPorts.in.on "begingroup", (group) =>

Only at root level

          if @level is 0
            for route, i in @routes
              if group.match(route)?
                @matchedRouteIndex = i
                if @outPorts.route.isAttached()
                  @outPorts.route.send(group)
                  @outPorts.route.disconnect()
                break
    
          else if @matchedRouteIndex? and @outPorts.out.isAttached @matchedRouteIndex
            @outPorts.out.beginGroup(group, @matchedRouteIndex)
          else if @outPorts.missed.isAttached()
            @outPorts.missed.beginGroup(group)
    

Go one level deeper

          @level++
    
        @inPorts.in.on "data", (data) =>
          if @matchedRouteIndex? and @outPorts.out.isAttached @matchedRouteIndex
            @outPorts.out.send(data, @matchedRouteIndex)
          else if @outPorts.missed.isAttached()
            @outPorts.missed.send(data)
    
        @inPorts.in.on "endgroup", (group) =>

Go one level up

          @level--
    

Remove matching if we're at root and it's currently matching

          if @level is 0 and @matchedRouteIndex?
            @matchedRouteIndex = null
    
          if @matchedRouteIndex? and @outPorts.out.isAttached @matchedRouteIndex
            @outPorts.out.endGroup(@matchedRouteIndex)
          else if @outPorts.missed.isAttached()
            @outPorts.missed.endGroup()
    
        @inPorts.in.on "disconnect", =>
          @outPorts.out.disconnect()
          @outPorts.missed.disconnect() if @outPorts.missed.isAttached()
    
    exports.getComponent = -> new RegexpRouter
    
