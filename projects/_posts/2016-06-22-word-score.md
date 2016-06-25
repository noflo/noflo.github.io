---
layout: projects
title: Word Score
categories:
  - projects
weight: 3
---


## 1) define our ports


```coffeescript
noflo = require 'noflo'
natural = require 'natural'
tokenizer = new natural.WordTokenizer()

exports.getComponent = ->
  c = new noflo.Component
    description: 'Find how the input words compare against the list of weighted words'
    inPorts:
      list:
        datatype: 'array'
        description: 'list of words we will use with the list of content'
        control: true
        required: true
      content:
        datatype: 'string'
        description: 'the content which we will determine the score of'
        required: true
    outPorts:
      score:
        datatype: 'number'
        description: 'the resulting number of comparing the content with the list'
        required: true
```


## 2) define our process and the precondition


```coffeescript
noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
    description: 'Find how the input words compare against the list of weighted words'
    inPorts:
      list:
        datatype: 'array'
        description: 'list of words we will use with the list of content'
        control: true
        required: true
      content:
        datatype: 'string'
        description: 'the content which we will determine the score of'
        required: true
    outPorts:
      score:
        datatype: 'number'
        description: 'the resulting number of comparing the content with the list'
        required: true

  # we are only using data, so we do not need any brackets sent to the inPorts, pass them along
  c.forwardBrackets =
    list: 'out'
    content: 'out'
  c.process = (input, output) ->
    # our precondition, make sure it has both before trying to get the data
    return unless input.has 'list', 'content', (ip) -> ip.type is 'data'
```


## 3) start processing


```coffeescript
noflo = require 'noflo'
natural = require 'natural'
tokenizer = new natural.WordTokenizer()

exports.getComponent = ->
  c = new noflo.Component
    description: 'Find how the input words compare against the list of weighted words'
    inPorts:
      list:
        datatype: 'array'
        description: 'list of words we will use with the list of content'
        control: true
        required: true
      content:
        datatype: 'string'
        description: 'the content which we will determine the score of'
        required: true
    outPorts:
      score:
        datatype: 'number'
        description: 'the resulting number of comparing the content with the list'
        required: true

  # we are only using data, so we do not need any brackets sent to the inPorts, pass them along
  c.forwardBrackets =
    list: 'out'
    content: 'out'

  c.process (input, output) ->
    # our precondition, make sure it has both before trying to get the data
    return unless input.has 'list', 'content', (ip) -> ip.type is 'data'

    # get the data
    # content = input.getData 'content'
    # list = input.getData 'list'
    # @TODO: temporary hack since getData does not behave as one expects, change when fixed
    content = ((input.getStream('content').filter (ip) -> ip.type is 'data').map (ip) -> ip.data)[0]
    list = input.getStream('list')[0].data

    # our base score we will send out
    score = 0

    # splits content into an array of words
    contents = tokenizer.tokenize content

    # if the list has the word in it, return the score
    # otherwise, 0 points
    wordScore = (word) ->
      if list[word]?
        return list[word]
      else
        return 0

    # go through each of the comparisons in the list
    # if it is Canadian: 1, American: -1, British: .5, None: 0
    spellingScore = (word) ->
      for comparison in list
        if word not in comparison["American"]
          if word in comparison["Canadian"]
            return 1
          else if word in comparison["British"]
            return 0.5
        else
          return -1

      return 0

    # if it has this, it is a spelling list
    if list[0]?["Canadian"]?
      scoringFunction = spellingScore
    # otherwise it is an object list of words with scores
    else
      scoringFunction = wordScore

    # use this to singularize and pluralize each word
    nounInflector = new natural.NounInflector()

    # go through each item in contents
    for data in contents
      plural = nounInflector.pluralize data
      singular = nounInflector.singularize data

      # if it is already plural or singular do not use it
      if plural isnt data
        score += scoringFunction plural
      if singular isnt data
        score += scoringFunction singular

      score += scoringFunction data

    # we could do `output.sendDone score` if we wanted
    # since there is only one outport it will know which one we mean
    output.sendDone score: score
```

[See the component](https://github.com/aretecode/canadianness/blob/master/components/WordScore.coffee)

- [previous step (FindEhs)](/projects/find-ehs)
- [next step (Graphs)](/projects/graphs)
