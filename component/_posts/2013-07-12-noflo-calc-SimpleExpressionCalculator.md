---
  title: "SimpleExpressionCalculator"
  library: "noflo-calc"
  layout: "component"

---

```coffeescript

noflo = require "noflo"
mathjs = require "mathjs"

```
This component evaluates mathematical expressions received on the IN port and sends the output to the OUT port.

<pre>
           +----------------------------+
           |                            |----OUT---->
----IN---->| SimpleExpressionCalculator |
           |                            |---ERROR--->
           +----------------------------+
</pre>


```coffeescript
class SimpleExpressionCalculator extends noflo.Component
  constructor: ->
    @inPorts =
```
IN in port receives text of an expression to be evaluated.
You can see examples of expressions on the [MathJS web site](http://mathjs.org)

```coffeescript
      in: new noflo.Port()
    @outPorts =
```
OUT out port sends the value calculated from the expression received on the IN port.

```coffeescript
      out: new noflo.Port()
```
ERROR out port sends any error messages from parsing the expression received on the IN port.

```coffeescript
      error: new noflo.Port()

    @inPorts.in.on "data", (expression) =>
      try
        @outPorts.out.send mathjs.eval(expression)
      catch e
        @outPorts.error.send expression: expression, message: e.message

```
Cascade the group and disconnection behaviour of the in port.

```coffeescript
    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)
      @outPorts.error.beginGroup(group)

    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()
      @outPorts.error.endGroup()

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()
      @outPorts.error.disconnect()

exports.getComponent = -> new SimpleExpressionCalculator()

```