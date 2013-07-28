---
  title: "TemplateReplace"
  library: "noflo-strings"
  layout: "component"

---

```coffeescript
noflo = require "noflo"
_ = require "underscore"
_s = require "underscore.string"

class TemplateReplace extends noflo.Component

  description: _s.clean "The inverse of 'Replace': fix the template and pass in
  an object of patterns and replacements."

  constructor: ->
    @template = null

    @inPorts =
      in: new noflo.Port()
      template: new noflo.Port()
    @outPorts =
      out: new noflo.Port()

    @inPorts.template.on "data", (template) =>
      @template = template if _.isString template

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group

    @inPorts.in.on "data", (data) =>
      string = @template or ""

      for pattern, replacement of data
        pattern = new RegExp(pattern, "g")
        string = string.replace pattern, replacement

      @outPorts.out.send string

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new TemplateReplace

```