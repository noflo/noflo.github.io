---
layout: documentation
title: Writing projects
categories:
  - projects
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
  # ---------------------------------------

  # 2) define our process and the precondition

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
      return unless input.has 'list', 'content'
  ```
  # ---------------------------------------

  # 3) start processing

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
    c.process = (input, output) ->
      # our precondition, make sure it has both before trying to get the data
      return unless input.has 'list', 'content'

      # get the data
      content = input.getData 'content'
      list = input.getData 'list'

      # our base score we will send out
      score = 0

      # splits content into an array of words
      contents = tokenizer.tokenize content

      # figure out how important each word is to the content
      # https://github.com/NaturalNode/natural#tf-idf
      # maybe split some up into sections and add those to the documents? Every sentence maybe?
      tfidf = new natural.TfIdf()
      tfidf.addDocument content
      for data in content
        tfidf.tfidfs data, (index, measure) ->
          console.log measure

      ###
      wordScore = (comparison, word)
        for comparison
          if word not in comparison["American"].split " "
            if word in comparison["Canadian"].split " "
              return 1
            else if word in comparison["British"].split " "
              return 0.5
            else
              return 0
          else
            return -1
      ###

      # we could do `output.sendDone score` if we wanted
      # since there is only one outport it will know which one we mean
      output.sendDone score: score
  ```
#... train on the positive words?
