---
  title: "Push"
  library: "noflo-git"
  layout: "component"

---

    noflo = require 'noflo'
    gitgo = require 'gitgo'
    
    class Push extends noflo.AsyncComponent
      constructor: ->
        @repository = null
        @local = 'master'
    
        @inPorts =
          local: new noflo.Port
          remote: new noflo.Port
          repo: new noflo.Port
        @outPorts =
          out: new noflo.Port
          error: new noflo.Port
    
        @inPorts.repo.on 'data', (data) =>
          @repository = data
    
        @inPorts.local.on 'data', (data) =>
          @local = data
    
        super 'remote'
    
      doAsync: (remote, callback) ->
        unless @repository
          callback new Error 'no repository directory specified'
          return
    
        request = gitgo @repository, [
          'push'
          remote
          @local
        ]
    
        errors = []
        request.on 'error', (err) =>
          errors.push err
        request.on 'end', =>
          if errors.length
            @outPorts.out.disconnect()
            return callback errors[1]
          @outPorts.out.beginGroup remote
          @outPorts.out.send @repository
          @outPorts.out.endGroup()
          @outPorts.out.disconnect()
          callback()
        @outPorts.out.connect()
    
    exports.getComponent = -> new Push
    
