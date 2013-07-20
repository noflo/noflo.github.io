---
  title: "Build"
  library: "noflo-pg"
  layout: "component"

---

    noflo = require("noflo")
    _ = require("underscore")
    _s = require("underscore.string")
    
    class Build extends noflo.Component
    
      description: _s.clean "build an SQL statement using a template, which
      will not be constructed until all placeholders are filled"
    
      constructor: ->
        @placeholder = null
        @parts = {}
        @defaults = {}
        @defaultGroup = null
        @statement = null
        @groups = []
    
        @inPorts =
          in: new noflo.ArrayPort
          sql: new noflo.Port
          default: new noflo.Port
        @outPorts =
          out: new noflo.Port
    
        @inPorts.sql.on "data", (@statement) =>
    
        @inPorts.default.on "begingroup", (@defaultGroup) =>
    
        @inPorts.default.on "endgroup", =>
          @defaultGroup = null
    
        @inPorts.default.on "data", (defaultValue) =>
          if @defaultGroup?
            @defaults[@defaultGroup] = defaultValue
    
        @inPorts.in.on "begingroup", (group) =>

If the group is a placeholder, save as such

          if group.match(/^&/)?
            @placeholder = group

Otherwise, save as a group

          else
            @groups.push(group)
    
        @inPorts.in.on "data", (data) =>
          if @placeholder?
            @parts[@placeholder] ?= []
            @parts[@placeholder].push(data)
    
        @inPorts.in.on "endgroup", (group) =>
          if group is @placeholder
            @placeholder = null
    
        @inPorts.in.on "disconnect", =>
          @constructSql()
    
      constructSql: ->
        parts = @parts
        statement = @statement
        queries = []
    

Only when statement and parts are ready

        return unless statement?
    

Deal with provided values

        for placeholder, part of parts
          segment = ""
    

Multiple

          if part.length >= 2
            segment = "#{part.join(",")}"

Single

          else if part.length >= 1
            segment = "#{part[0]}"
    
          regex = new RegExp("([^\\\\])#{placeholder}", "g")
          statement = statement.replace(regex, "$1#{segment}")
    

Deal with defaults

        for placeholder, def of @defaults
          regex = new RegExp("([^\\\\])#{placeholder}", "g")
          statement = statement.replace(regex, "$1#{def}")
    

Send if statement is fulfilled

        unless statement.match(/[^\\\\]&/)?

Deal with escape characters

          statement = statement.replace("\\\&", "\&")
    

Send it

          @groups = _.uniq(@groups)
    
          for group in @groups
            @outPorts.out.beginGroup(group)
    
          @outPorts.out.send(statement)
          
          for group in @groups
            @outPorts.out.endGroup()
    
          @outPorts.out.disconnect()
    

Reset stuff

          @parts = {}
          @groups = []
    
    exports.getComponent = -> new Build
    
