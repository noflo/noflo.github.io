---
  title: "Commit"
  library: "noflo-git"
  layout: "component"

---

    noflo = require 'noflo'
    gitgo = require 'gitgo'
    
    class Commit extends noflo.AsyncComponent
      constructor: ->
        @repository = null
    
        @inPorts =
          in: new noflo.Port
          repo: new noflo.Port
        @outPorts =
          out: new noflo.Port
          error: new noflo.Port
    
        @inPorts.repo.on 'data', (data) =>
          @repository = data
    
        super()
    
      doAsync: (message, callback) ->
        unless @repository
          callback new Error 'no repository directory specified'
          return
    
        request = gitgo @repository, [
          'commit'
          '-m'
          message
        ]
    
        errors = []
        request.on 'error', (err) =>
          errors.push err
        request.on 'end', =>
          if errors.length
            @outPorts.out.disconnect()
            return callback errors[1]
          @outPorts.out.beginGroup message
          @outPorts.out.send @repository
          @outPorts.out.endGroup()
          @outPorts.out.disconnect()
          callback()
        @outPorts.out.connect()
    
    exports.getComponent = -> new Commit
    
