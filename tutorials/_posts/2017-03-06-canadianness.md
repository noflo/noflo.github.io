---
layout: projects
title: "Tutorial: Data transformation"
---

-------------------------
## Project steps:

### Initial:
- [Idea](#idea)
- [Requirements](#requirements)
- [Planning](#planning)
- [Researching](#researching)
- [Pseudo code](#pseudo-code)

### Writing components
- [FindEhs](/projects/find-ehs)
- [DetermineEmotion](/projects/determine-emotion)
- [WordScore](/projects/word-score)

### Writing graphs
- [Graphs](/projects/graphs)

### Testing
- [Testing](/projects/testing)

### Finishing up
- [Embedding](/projects/embedding)
- [Summary](/projects/summary)

[See the full project](https://github.com/aretecode/canadianness)

-------------------------
# Idea <a id="idea"></a>

Make a project that calculates how Canadian a string is.
As an added bonus, it will determine the emotion of the string based on how _eh_'s are used.


-------------------------
# Requirements <a id="requirements"></a>

Use:
- our own components
- other peoples components (other noflo libraries components)
- can use fbp
- graphs
- subgraphs
- tests (use fbp-spec and mocha tests to show both options)
- debugging


-------------------------
# Planning <a id="planning"></a>

- To determine how Canadian something is, we want to check words inside of the string.
  - ~ If it is easily possible, figure out how far words are from each other
  - ~ and their location inside of the string (ie, at the very end, beginning, near the end.)
  - Check spelling of words, Canadan vs elsewhere. Canadian spelling first, then UK, then American.
  - Check the emotion of the word _eh_ using symbols and letter case (ie, eh, Eh, EH, EH?, eh?!)
- The output should have the _Emotion_, and the _Canadian Score_.

-------------------------
# Researching <a id="researching"></a>

## Word Weight
Search Google for a library that may be able to help us with dealing with word weights, singularize, and pluralize words.
[js library determine weight of words](https://www.google.com/search?q=js%20library%20determine%20weight%20of%20words)
[NaturalNode](https://github.com/NaturalNode/natural) looks promising

## Spelling
Search Google for the spelling differences
[Canadian vs uk vs usa spelling](https://www.google.com/search?q=canadian%20vs%20uk%20vs%20usa%20spelling)

perfect
[Canadian, British and American Spelling](http://www.lukemastin.com/testing/spelling/cgi-bin/database.cgi?action=view_category&database=spelling&category=C)
This is data on a table though with no apparent api, so we should get it into usable data (json).
[get table as json](https://www.google.com/search?q=get+table+data+as+json)
[table to json](http://johndyer.name/html-table-to-json/)
[table to json jquery](https://www.dynatable.com/)


-------------------------
# Pseudo code <a id="pseudo-code"></a>

TODO: move into overall arch or project definition

```
[How Canadian]
  INPUT=CONTENT(string)
  INPUT=WORDS(array) # words to use as weights
  INPUT=SPELLING(array)
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
  [CanadianScore] # LIST would use WORDS
  [SpellingScore] # LIST would use SPELLING

    # output of CanadianScore & SpellingScore should be added together to get result
    # score from here is the SCORE
    [noflo/Math/Add]
```

# Overall architecture

## Emotion

This can be its own graph loaded inside of the main graph as a [subgraph](/documentation/graphs/#subgraphs) so the whole operation can be represented as a box:

```FBP
# (string)
INPORT=FINDEHS.CONTENT:CONTENT
# (string)
OUTPORT=DetermineEmotion.EMOTION:EMOTION

FindEhs(FindEhs) MATCHES -> CONTENT DetermineEmotion(DetermineEmotion)
```

[See the graph](https://github.com/aretecode/canadianness/blob/master/graphs/Emotion.fbp)
<img src="/img/emotion.png" alt="noflo canadianness emotion graph"/>

## Canadianness

### Real graph implementation of pseudo code:

```
graph = "
# (string)
INPORT=SplitContent.IN:CONTENT
# (array)
INPORT=SpellingScore.LIST:SPELLING
# (array)
INPORT=CanadianScore.LIST:WORDS

# (string)
OUTPORT=Emotion.EMOTION:EMOTION
# (int)
OUTPORT=Add.SUM:SCORE

# [core/Split](https://github.com/noflo/noflo-core/blob/master/components/Split.coffee) takes the input
# and sends it to each of the [sockets](http://noflojs.org/api/InternalSocket/) attached to the outport
# ----
# Emotion is subgraph
SplitContent(core/Split) OUT -> CONTENT Emotion(canadianness/Emotion)
SplitContent OUT -> CONTENT SpellingScore(canadianness/WordScore)
SplitContent OUT -> CONTENT CanadianScore(canadianness/WordScore)

SpellingScore SCORE -> ADDEND Add(math/Add)
CanadianScore SCORE -> AUGEND Add
"
```

[See the graph](https://github.com/aretecode/canadianness/blob/master/graphs/Canadianness.fbp)
<img src="/img/canadianness.png" alt="noflo canadianness graph"/>

## Writing tests

First in line for testing, we have [fbp-spec](https://github.com/flowbased/fbp-spec)

Just add a `fbpspec.coffee` file in `/spec` directory

Important to note, you cannot send brackets or do any sort of special operations using fbp-spec. To get around that, you will have to write [components exclusively for testing](https://github.com/aretecode/canadianness/blob/master/components/TestDetermineEmotion.coffee), and [fbp graphs as fixtures](https://github.com/aretecode/canadianness/blob/master/spec/determineemotion.yaml#L3).

The command we use for noflo, and the flags can be found at [noflo-nodejs flags](https://github.com/noflo/noflo-nodejs/blob/master/src/noflo-nodejs.coffee#L13)

```coffeescript
fbpspec = require 'fbp-spec'

nodeRuntime =
  label: "NoFlo node.js"
  description: ""
  type: "noflo"
  protocol: "websocket"
  secret: 'notasecret'
  address: "ws://localhost:3333"
  id: "7807f4d8-63e0-4a89-a577-2770c14f8106"
  command: './node_modules/.bin/noflo-nodejs --verbose --catch-exceptions=false --secret notasecret --port=3333 --host=localhost --register=false --capture-output=true --debug=true'

fbpspec.mocha.run nodeRuntime, './spec',
  fixturetimeout: 20000
  starttimeout: 100000
```

Then, for each test, just add a `yaml` file in the `/spec` directory, each `yaml` file in `/spec` is loaded by the `fbp-spec`.

```yaml
topic: "canadianness/FindWords"
name: "Find words fbpspec"
cases:
-
  name: 'content eh'
  assertion: 'should be find one `eh`'
  inputs:
    word: 'eh'
    surrounding: false
    content: 'eh'
  expect:
    matches:
      equals: 'eh'
```

## Implement components

### DetermineEmotion

{% include tutorials/canadianess/DetermineEmotion.html %}

### FindWords

{% include tutorials/canadianess/FindWords.html %}

## WordScore

{% include tutorials/canadianess/WordScore.html %}

## Providing a JavaScript API

TODO: write
