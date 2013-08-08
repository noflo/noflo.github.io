---
  title: "MakeDir"
  library: "noflo-filesystem"
  layout: "component"

---

```coffeescript
fs = require 'fs'
path = require 'path'
noflo = require 'noflo'

class MakeDir extends noflo.AsyncComponent
  constructor: ->
    @inPorts =
      in: new noflo.Port 'string'
    @outPorts =
      out: new noflo.Port 'string'
      error: new noflo.Port 'object'

    super()

  sendPath: (dirPath) ->

  doAsync: (dirPath, callback) ->
    @mkDir dirPath, (err) =>
      return callback err if err
      @outPorts.out.send dirPath
      @outPorts.out.disconnect()
      callback null

  mkDir: (dirPath, callback) ->
    orig = dirPath
    dirPath = path.resolve dirPath

```
Try creating it

```coffeescript
    fs.mkdir dirPath, (err) =>
```
Directory was created

```coffeescript
      unless err
        return callback null

      switch err.code
```
Parent missing, create

```coffeescript
        when 'ENOENT'
          @mkDir path.dirname(dirPath), (err) =>
            return callback err if err
            @mkDir dirPath, callback

```
Check if the directory actually exists already

```coffeescript
        else
          fs.stat dirPath, (statErr, stat) =>
            return callback err if statErr
            return callback err unless stat.isDirectory()
            callback null

exports.getComponent = -> new MakeDir

```