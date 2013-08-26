---
  title: "Setup"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
_ = require 'underscore'
Spooky = require 'spooky'

class Setup extends noflo.Component
  constructor: ->
    @inPorts =
      url: new noflo.Port 'string'
      rules: new noflo.Port 'object'
      options: new noflo.Port 'object'
    @outPorts =
      out: new noflo.Port 'object'
      error: new noflo.Port 'object'

    @inPorts.url.on 'data', (@url) =>
    @inPorts.rules.on 'data', (@rules) =>
    @inPorts.options.on 'data', (@options) =>

    @inPorts.url.on 'disconnect', =>
      @setup()
    @inPorts.rules.on 'disconnect', =>
      @setup()

  setup: ->
    @options ?= {}

```
Path to vendor scripts

```coffeescript
    vendorPath = "#{__dirname}/../vendor"

```
Always add jQuery

```coffeescript
    _.extend @options,
      clientScripts: [
        "#{vendorPath}/jquery-2.0.3.min.js"
      ]

```
Only continue if we have both URL and rules

```coffeescript
    return unless @url and @rules

```
Input validity check

```coffeescript
    isValidRuleObject = @isValidRuleObject @rules
    isValidOptionObject = @isValidOptionObject @options
    unless isValidRuleObject is true
      error = isValidRuleObject
    unless isValidOptionObject is true
      error = isValidOptionObject

```
Send to error on invalid input

```coffeescript
    if error?
      e = new Error error
      e.url = @url
      e.rules = @rules
      e.options = @options

      throw e unless @outPorts.error.isAttached()
      @outPorts.error.send e
      @outPorts.error.disconnect()

```
Setup Spooky and continue if all is good

```coffeescript
    else
      @setupSpooky()

```
Reset the cache either way

```coffeescript
    delete @url
    delete @rules
    delete @options

  setupSpooky: ->
    rules = @rules
    url = @url
    options = @options

```
Create a Spooky instance

```coffeescript
    spooky = new Spooky
      casper: options
    , (error) =>
```
Send to error if initialization fails

```coffeescript
      if error
        e = new Error 'Failed to initialize SpookyJS'
        e.details = error
        e.url = url
        e.rules = rules
        e.options = options
        @outPorts.error.send e
        @outPorts.error.disconnect()
        return

```
Spooky could have unlimited event listeners

```coffeescript
      spooky.setMaxListeners 0

```
Any error in Casper is reported

```coffeescript
      spooky.on 'error', (e) ->
        console.error e

```
Output all console messages if verbose

```coffeescript
      if options.verbose
        spooky.on 'console', (line) ->
          console.log line

```
Start with some page

```coffeescript
      spooky.start url

```
Forward the packet

```coffeescript
      @outPorts.out.send
        spooky: spooky
        rules: rules
        counts: {}
      @outPorts.out.disconnect()

```
Is the option object valid?

```coffeescript
  isValidOptionObject: (options) ->
    _.isObject(options) or 'Options object is not valid'

```
Is the rule object valid?

```coffeescript
  isValidRuleObject: (rules) ->
    unless _.isArray rules
      return 'Rule object must be an array'
    unless rules.length > 0
      return 'Empty rule object'

    for rule in rules
      valid = _.isObject(rule) and
        _.isString(rule.selector) and
        _.isArray(rule.actions) and
        _.isArray(rule.conditions)

      unless valid
        return 'Rule object must contain a selector, actions, and conditions'

      for action in rule.actions
        unless _.isObject(action) and _.isString(action.action)
          return 'Rule object actions must contain an action property'

      for condition in rule.conditions
        unless _.isObject(condition)
          return 'Rule object conditions must contain a value property'

      return true

exports.getComponent = -> new Setup

```