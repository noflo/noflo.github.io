---
layout: documentation
title: Writing projects
---

# Canadian-ness
------
put it in a graph and call it from a normal js function in one place like index, but call the graph from fbp-spec, SWEET


---------
- using your own components
- using other peoples components
- can use fbp
- graphs
- subgraphs
- tests (use fbp spec first, maybe in another file use mocha)
- debugging
- something we should make clear is that it is just a js lib and that people can use it in their own projects as a part, or as the entire thing. They don't have to use noflo specific testing tools and can use whatever they want. (use http as an example)
- adding node edges in coffeescript as well as http?
- use example using it

-------------------




###
@TODO: add error outports and connect in graph
###


###
- [Idea](#idea)
- [Requirements](#requirements)
- [Planning](#planning)
- [Researching](#researching)
- [Pseudo code](#pseudo-code)
- [Implementation](#implementation)
- [Summary][#summary]
###


###
# Idea
Make a project that calculates how Canadian a string is.
As an added bonus, it will determine the emotion of the string based on how _eh_'s are used.
###

###
# Requirements
Use:
- our own components
- another noflo libraries components (@TODO: link to publishing)
- a graph
- a subgraph
- tests
- debugging
###

###
# Planning
- To determine how Canadian something is, we want to check words inside of the string.
  - ~ If it is easily possible, figure out how far words are from each other
    ~ and their location inside of the string (ie, at the very end, beginning, near the end.)
  - Check spelling of words, Canadan vs elsewhere. Canadian spelling first, then UK, then American.
  - Check the emotion of the word **eh** using symbols and letter case (ie, eh, Eh, EH, EH?, eh?!)
- The output should have the _Emotion_, and the _Canadian Score_.

###

###
# Researching
  ## Word Weight
  Search Google for a library that may be able to help us with dealing with word weights
  [js library determine weight of words](https://www.google.com/search?q=js%20library%20determine%20weight%20of%20words)

  looks promising
  [NaturalNode](https://github.com/NaturalNode/natural)

  ## Spelling
  Search Google for the spelling differences
  [Canadian vs uk vs usa spelling](https://www.google.com/search?q=canadian%20vs%20uk%20vs%20usa%20spelling)

  perfect
  [Canadian, British and American Spelling](http://www.lukemastin.com/testing/spelling/cgi-bin/database.cgi?action=view_category&database=spelling&category=C)
  This is data on a table though with no apparent api, so we should get it into usable data.
  [get table as json](https://www.google.com/search?q=get+table+data+as+json)
  [table to json](http://johndyer.name/html-table-to-json/)
  [table to json jquery](https://www.dynatable.com/)

###

###
# Pseudo code
```
[How Canadian]
  INPUT=CONTENT(string)
  INPUT=POSITIVE(array) # words to use as weights
  INPUT=NEGATIVE(array)
  OUTPUT=EMOTION(string)
  OUTPUT=SCORE(number)

  # if we wanted to swap out emotion to calculate emoji insteadof _eh_ for example,
  # we can easily just replace this box. the same goes for any noflo box.
  [Emotion]
    INPUT=CONTENT(string)
    OUTPUT=EMOTION(string)
    [Find Ehs]
      # if it has no _eh_, emotion is flat

      # could also separate to collect and doing each and then sending another stream
      # and putting those back together as a score and using add

      # collects stream, determines emotion of each
      [Determine Emotion]

  [WordScore]
    OUTPUT=SCORE(number)
    INPUT=LIST(array) # control port, because we want to use one for each input
    INPUT=CONTENT(STRING)

  # since these both calculate score, one positive, one negative,
  # they can be separate instances of the same component
  [CanadianScore] # LIST would use POSITIVE
  [UncandainScore]# LIST would use NEGATIVE

    # output of CanadianScore & UncanadianScore should be added together to get result
    # score from here is the SCORE
    [noflo/Math/Add]
```
###


###
Data
  Positive:
  # @TODO: what happens when you singularize a singular?
  # plurize
  sorry: 11
  moose
  poutine
  eh
  ice
  timmy
  queen
  mounty, rcmp
  bear
  cougar
  buddy
  pal
  friend
  tree
  syrup

  Negative:
  color
  * angry words
  president
  speedos
  racism
  dictator
  homophobic
  yall

  @TODO: get all data from that page and parse as json?
  Spellings:
  colour

###


###
# Implementation

###


# --------------------------------------
# WordScore

  # 1) define our ports
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

  # ---------------------------------------

  # 2) define our process and the precondition
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

  # ---------------------------------------

  # 3) start processing
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

# [ 'your', 'dog', 'has', 'fleas' ]
#... train on the positive words?


# -------------------------------------------
# Emotion
# this can be its own graph loaded inside of the main graph (a _subgraph_ @TODO: link to subgraph)
# so the whole operation can be represented as a box

```FBP
# (string)
INPORT=FINDEHS.CONTENT:CONTENT
# (string)
OUTPORT=DetermineEmotion.EMOTION:EMOTION

FindEhs(FindEhs) MATCHES -> CONTENT DetermineEmotion(DetermineEmotion)
```



# -------------------
# FindEhs
  # 1) define our ports
  noflo = require 'noflo'

  exports.getComponent = ->
    c = new noflo.Component
      description: 'Find all of the instances of `word` in `content` and send them out in a stream'
      inPorts:
        word:
          datatype: 'string' # could be array|string, which would be `all`
          description: 'the word we are looking for instances of'
          control: true
          required: true
        content:
          datatype: 'string'
          description: 'the content which we look for the word in'
          required: true
        surrounding: # could use a regex but this is a specific case
          datatype: 'boolean'
          description: 'whether to get surrounding characters, symbols before and after until space'
          default: false # if nothing is sent to it, this is the default when `get`ting from it
          control: true
      outPorts:
        matches:
          datatype: 'string'
          description: 'the resulting findings as a stream of data packets'
          required: true

    # we are only using data, so we do not need any brackets sent to the inPorts, pass them along
    c.forwardBrackets =
      content: 'out'
    c.process (input, output) ->
      return unless input.has 'word', 'content'
      word = input.getData 'word'
      content = input.getData 'content'

      output.send new noflo.IP 'openBracket', content

      # @TODO: matches
      for match in matches
        # if you just send content, it will automatically put it in a data ip
        # so this is the same as `output.send new noflo.IP 'data', match
        output.send match

      output.send new noflo.IP 'closeBracket', content

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

# -------------------------------------------


# --------------------------
# @TODO: document stuff on fbp graphs,
# how you only need to declare your component on the in way or out way
# @TODO: get the name of that from @vladimirs pm (outstream?)

# Real graph implementation of pseudo code
graph = "
# (string)
INPORT=SplitContent.CONTENT:CONTENT
# (array)
INPORT=CanadianScore.LIST:POSITIVE
# (array)
INPORT=UnCanadianScore.LIST:NEGATIVE

# (string)
OUTPORT=Add.EMOTION:EMOTION
# (int)
OUTPORT=Add.SUM:SCORE

# (core/Input @TODO: link) takes the input
# and sends it to each of the
# (@TODO: link for sockets) sockets attached to the outport
# ----
# Emotion is subgraph
SplitContent(core/Split) OUT -> CONTENT Emotion(Emotion)
SplitContent OUT -> CONTENT UnCanadianScore(WordScore)
SplitContent OUT -> CanadianScore(WordScore)

UnCanadianScore SCORE -> ADDEND Add(noflo-math/Add)
CanadianScore SCORE -> AUGEND Add
"

@TODO: register ***
scoping test for register compoinent


#########

# [good example of fbp-spec in use](https://github.com/c-base/ingress-table/tree/master/spec)
```yaml
  topic: "canadianness/Canadianness"
  name: "Candian Score calculation"
  fixture:
   type: 'fbp'
   data: |
    # @runtime noflo-nodejs
    INPORT=c.CONTENT:CONTENT
    INPORT=c.POSITIVE:POSITIVE
    INPORT=c.NEGATIVE:NEGATIVE
    OUTPORT=Add.EMOTION:EMOTION
    OUTPORT=Add.SCORE:SCORE
    OUTPORT=s.OUT:SCORE
    OUTPORT=e.OUT:EMOTION

    c(canadianness) SCORE -> IN s(core/Repeat)
    c(canadianness) EMOTION -> IN e(core/Repeat)

  cases:
  -
    name: 'content eh'
    assertion: 'should be neutral, yet highly Canadian'
    inputs:
      content: 'eh'
      positive:
      negative: # use component here or variables or? "$." in fbp-spec ingress-table?
    expect:
      score: 11
      emotion: 'neutral'

  -
    name: 'content "A bunch of centers had a color cancelation."'
    assertion: 'receiving neutral, and uncanadian'
    inputs:
      content: 'A bunch of centers had a color cancelation.'
      positive:
      negative: # use component here or variables or? "$." in fbp-spec ingress-table?
    expect:
      score: -1
      emotion: 'neutral'
```
#########



###
# Summary
###

# could use a library for words and such but this is for simplicity
# could use an object, {canada: 1, poutine: .5, timmy: 2, timmies: 3, sorry: 11}
# send them each to a component which takes in a word and a weight,
# which sends them all out wrapped in brackets as a stream

# or just use an already made list of them


