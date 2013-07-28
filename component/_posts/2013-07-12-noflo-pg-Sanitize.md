---
  title: "Sanitize"
  library: "noflo-pg"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")

class Sanitize extends noflo.Component

  description: "Makes sure the provided string pairs safe for SQL injection"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "begingroup", (@placeholder) =>
      @outPorts.out.beginGroup @placeholder

    @inPorts.in.on "data", (data) =>
```
Ignore if the *placeholder* starts with an ampersand

```coffeescript
      if @placeholder?.match? /^&/
        data = data

```
Ignore if data starts with an ampersand (an escape), but remove the
ampersand of course

```coffeescript
      else if data?.match? /^&/
        data = data.slice 1

      else if data is ""
        data = "''"

      else if _.isArray(data)
        data = "(#{_.map(data, @quote).join(", ")})"

      else if _.isString(data)
```
Remove duplicate quotes and for each remaining quote escape the quote
for SQL

```coffeescript
        data = "'#{data.replace(/'+/g, "'").replace(/'/g, "''")}'"

      else if _.isNumber(data)
        data = @quote data

      else
        data = "''"

      @outPorts.out.send data

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()
      @placeholder = null

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

  quote: (string) ->
    "'#{string}'"

exports.getComponent = -> new Sanitize

```