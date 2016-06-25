---
layout: projects
title: Determine Emotion
categories:
  - projects
weight: 1
---

## 1) define our ports

```coffeescript
noflo = require 'noflo'

# could also pass in full contents here and determine distance from each other
exports.getComponent = ->
  c = new noflo.Component
    description: 'Find all of the instances of `word` in `content` and send them out in a stream'
    inPorts:
      content:
        datatype: 'string'
        description: 'the content which we look for the word in'
        required: true
    outPorts:
      emotion:
        datatype: 'string'
        description: 'the emotion based the content in ehs'
        required: true
      error:
        datatype: 'object'
```

# 2) define our preconditions

```coffeescript
noflo = require 'noflo'

# could also pass in full contents here and determine distance from each other
exports.getComponent = ->
  c = new noflo.Component
    description: 'Find all of the instances of `word` in `content` and send them out in a stream'
    inPorts:
      content:
        datatype: 'string'
        description: 'the content which we look for the word in'
        required: true
    outPorts:
      emotion:
        datatype: 'string'
        description: 'the emotion based the content in ehs'
        required: true
      error:
        datatype: 'object'

  # we are using brackets to group the stream, so we do not want to forward them
  c.process (input, output) ->
    return unless input.hasStream 'content'
```

## 3) start processing

```coffeescript
noflo = require 'noflo'

# https://en.wikipedia.org/wiki/Mode_(statistics)
findMode = (array) ->
  frequency = {}
  maxFrequency = 0
  result = undefined
  for v of array
    frequency[array[v]] = (frequency[array[v]] or 0) + 1
    if frequency[array[v]] > maxFrequency
      maxFrequency = frequency[array[v]]
      result = array[v]
  result

# could also pass in full contents here and determine distance from each other
exports.getComponent = ->
  c = new noflo.Component
    description: 'Find all of the instances of `word` in `content` and send them out in a stream'
    inPorts:
      content:
        datatype: 'string'
        description: 'the content which we look for the word in'
        required: true
    outPorts:
      emotion:
        datatype: 'string'
        description: 'the emotion based the content in ehs'
        required: true
      error:
        datatype: 'object'

  # we are using brackets to group the stream, so we do not want to forward them
  c.process (input, output) ->
    return unless input.hasStream 'content'

    # we get the [full stream](noflojs.org/documentation/process-api/#full-stream)
    contents = input.getStream 'content'

    # since it has `openBracket` and `closeBracket` we only want the dat
    contents = contents.filter (ip) -> ip.type is 'data'

    # since it is an array of IP objects,
    # they contain other properties, we only want the data
    contents = contents.map (ip) -> ip.data

    # to hold the emotion matches
    matches = []

    # the emotions we will use
    emotions =
      joy: ['eh!']
      neutral: ['eh']
      amusement: ['eh?', 'Eh?', 'Eh??']
      fear: ['eH??', 'eh??']
      surprise: ['eh !?', 'EH!?']
      anticipation: ['eh?!']
      excitment: ['EH!', 'eH!']
      sadness: ['...eh', '...eh...', '..eh', 'eh..', '..eh..']
      anger: ['EH!?', 'EH?']

    # go through our content and our emotions
    # then add them to our `matches`
    for content in contents
      for emotion, data of emotions
        if content in data
          matches.push emotion

    # if we didn't get any emotions, it is default neutral
    if matches.length is 0
      mode = 'neutral'
    # if we did, we need to find the emotion that was the most common
    else
      mode = findMode matches

    output.sendDone emotion: mode
```

[See the component](https://github.com/aretecode/canadianness/blob/master/components/DetermineEmotion.coffee)

- [previous step (Index)](/projects)
- [next step (FindEhs)](/projects/find-ehs)
