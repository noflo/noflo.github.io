---
  title: "ObjectVariablesExpressionCalculator"
  library: "noflo-calc"
  layout: "component"

---

```coffeescript

noflo = require "noflo"
mathjs = require "mathjs"
util = require "util"
objectHelper = require "../lib/ObjectHelper"

```
This component evaluates mathematical expressions received on the IN port and sends the output to the OUT port.

<pre>
           +-------------------------------------+
--CONFIG-->|                                     |----OUT---->
           | ObjectVariablesExpressionCalculator |
---DATA--->|                                     |---ERROR--->
           +-------------------------------------+
</pre>


```coffeescript
class ObjectVariablesExpressionCalculator extends noflo.Component
  constructor: ->
    @pendingMessages = []

    @inPorts =
```
CONFIG in port receives a JavaScript object which includes text of an expression to be evaluated
as well as a list of calculation variables to look up the values for each DATA message.
You can see examples of expressions on the [MathJS web site](http://mathjs.org)

```coffeescript
      config: new noflo.Port()
```
DATA in port receives zero or many JavaScript objects which contain data for calculations.  Each
message on the DATA port should result in one message on either the OUT or ERROR ports.

```coffeescript
      data: new noflo.Port()
    @outPorts =
```
OUT out port sends the value calculated from the expression received on the DATA port.

```coffeescript
      out: new noflo.Port()
```
ERROR out port sends any error messages from parsing the expression received on the IN port.

```coffeescript
      error: new noflo.Port()

    @inPorts.config.on "data", (configMessage) =>
      @config = configMessage
```
console.log "Got a config message that looks like: " + util.inspect configMessage, { showHidden: true, depth: 10 }

```coffeescript
      sendCalculationResult dataMessage for dataMessage in @pendingMessages

    @inPorts.data.on "data", (dataMessage) =>
      if @config?
        @sendCalculationResult dataMessage
      else
        @pendingMessages.push dataMessage

```
Cascade the group and disconnection behaviour of the DATA in port.

```coffeescript
    @inPorts.data.on "begingroup", (group) =>
      @outPorts.out.beginGroup(group)
      @outPorts.error.beginGroup(group)

    @inPorts.data.on "endgroup", =>
      @outPorts.out.endGroup()
      @outPorts.error.endGroup()

    @inPorts.data.on "disconnect", =>
      @outPorts.out.disconnect()
      @outPorts.error.disconnect()

  addValueToArrayReturnPortAndMessage: (dataMessage, answer, arrayFunctionName) =>
    destinationObject = objectHelper.objectAtAddress(dataMessage, @config.output?.address)
    unless destinationObject?
      [@outPorts.error, { dataMessage: dataMessage, message: "The output.address value '#{@config.output.address}' specified in the configuration document does not exist in this data message." } ]
    if destinationObject instanceof Array
      destinationObject[arrayFunctionName](answer)
      [@outPorts.out, dataMessage]
    else
      [@outPorts.error, { dataMessage: dataMessage, message: "The output.address value specified in the configuration document #{@config.output.address} is not an array.  The configuration message requires answers to be added to the an array at that location in the data message." } ]

  decidePortAndMessage: (dataMessage, answer) =>
    switch @config.output?.action?.toUpperCase()
      when "ANSWER ONLY" then [@outPorts.out, answer]

      when "ASSIGN"
        objectHelper.objectAtAddress dataMessage, @config.output.address, answer
        [@outPorts.out, dataMessage]

      when "ADD TO ARRAY START"
        @addValueToArrayReturnPortAndMessage dataMessage, answer, "unshift"
      when "ADD TO ARRAY END"
        @addValueToArrayReturnPortAndMessage dataMessage, answer, "push"
      else
        [@outPorts.error, { expression: @config.expression, message: "Unknown output action '#{@config.output?.action}' or nothing is specified in the output.action section of the configuration message." } ]

  sendCalculationResult: (dataMessage) =>
    try
      calculationVariables = objectHelper.blendPropertiesFrom(@config.variables, dataMessage)
      answer = mathjs.eval(@config.expression, calculationVariables)

      [port, message] = @decidePortAndMessage dataMessage, answer

      port.send message
    catch e
      @outPorts.error.send config: @config, dataMessage: dataMessage, message: "Error performing calculation: '#{e.message}'"

exports.getComponent = -> new ObjectVariablesExpressionCalculator()

```