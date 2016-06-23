---
layout: documentation
title: Writing projects
categories:
  - projects
---

# DetermineEmotion
# 1) define our ports
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
    contents = input.getStream 'content'

    # @TODO:
    # if it has no data, just open and close
    # then send out neutral

    matches = {}

    # @TODO: add emoticons next to them?
    # @TODO: wjhat to use for `q` when it is right next to another char?
    # https://github.com/NaturalNode/natural#classifiers
    classifier = new natural.BayesClassifier()
    # change to json
    classifier.addDocument 'eh', 'neutral'
    classifier.addDocument 'eh!', 'joy'
    classifier.addDocument ['eh?', 'Eh?', 'Eh??'], 'amusement'
    classifier.addDocument ['eH??', 'eh??'], 'fear'
    classifier.addDocument ['eh !?', 'EH!?'], 'surprise'
    classifier.addDocument 'eh?!', 'anticipation'
    classifier.addDocument ['EH!', 'eH!'], 'excitment'
    classifier.addDocument ['...eh', '...eh...', '..eh', 'eh..', '..eh..'], 'sadness'
    classifier.addDocument ['EH!?', 'EH?'], , 'anger'
    classifier.train()

    matches.push classified.classify content for content in contents
    mode = findMode matches

    output.send emotion: mode
