---
  title: "ParseSource"
  library: "noflo-docco"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
docco = require 'docco'

class CreateDocument extends noflo.Component
  constructor: ->
    @fileName = null
    @inPorts =
      source: new noflo.Port
      filename: new noflo.Port
    @outPorts =
      out: new noflo.Port
    
```
We need a filename for correct source code detection based on language

```coffeescript
    @inPorts.filename.on 'data', (fileName) =>
      @fileName = fileName

```
Forward the groups normally

```coffeescript
    @inPorts.source.on 'beginGroup', (group) =>
      @outPorts.out.beginGroup group
    @inPorts.source.on 'data', (data) =>
```
Parse the source code using Docco and forward the chunks

```coffeescript
      chunks = docco.parse @fileName, data
      @outPorts.out.send chunk for chunk in chunks
      @outPorts.out.disconnect()
    @inPorts.source.on 'endGroup',  =>
      @outPorts.out.endGroup()

exports.getComponent = -> new CreateDocument

```