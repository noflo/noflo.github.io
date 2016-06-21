---
layout: documentation
title: Language for Flow-Based Programming
---
In addition to the JSON format described above, FBP has its own Domain-Specific Language (DSL) for easy graph definition. The syntax is the following:

* `'somedata' -> PORT Process(Component)` sends initial data _somedata_ to port _PORT_ of process _Process_ that runs component _Component_
* `A(Component1) X -> Y B(Component2)` sets up a connection between port _X_ of process _A_ that runs component _Component1_ and port _Y_ of process _B_ that runs component _Component2_

You can connect multiple components and ports together on one line, and separate connection definitions with a newline or a comma (`,`).

>
> (did you know / helpful tip) Components only have to be specified the first time you mention a new process. The specification can be on the way out, or the way in @TODO: example
>

You can find more information in the [README of the stand-alone FBP parser](https://github.com/noflo/fbp#readme).

Example:

```coffeescript
'somefile.txt' -> SOURCE Read(ReadFile) OUT -> IN Split(SplitStr)
Split OUT -> IN Count(Counter) COUNT -> IN Display(Output)
Read ERROR -> IN Display
```

## Loading and running graphs

NoFlo supports the FBP language fully. You can either load a graph with a string of FBP-language commands with:

```coffeescript
fbpData = "<some FBP language connections>"

noflo = require "noflo"
noflo.graph.loadFbp fbpData, (graph) ->
  console.log "Graph loaded"
  console.log graph.toDOT()
```
```javascript
var fbpData = "<some FBP language connections>";

var noflo = require("noflo");
noflo.graph.loadFbp(fbpData, function(graph) {
  console.log("Graph loaded");
  console.log(graph.toDOT());
 });
```

The `.fbp` file suffix is used for files containing FBP language. This means you can load them also the same way as you load JSON files, using the `noflo.loadFile` method, or the NoFlo shell. Example:

```bash
$ noflo examples/linecount/count.fbp
```

## FBP to JSON
[flowbased](https://github.com/flowbased/fbp) can be used to convert your FBP to JSON.

## Inline FBP in web applications

In addition to separate files, FBP graph definitions can also be defined inline in HTML. The typical way to do this is to utilize a `script` tag. For example, the following would change the contents of an element identified with the ID `header` to say *Hello World*:

```html
<script type="application/fbp" id="main">
  '#header' -> SELECTOR GetHeader(dom/GetElement)
  'Hello World' -> HTML WriteContent(dom/WriteHTML)
  GetHeader ELEMENT -> CONTAINER WriteContent
</script>
```

Loading and running inline FBP is quite simple:

```javascript
// Get the FBP contents
var fbp = document.getElementById('main').textContent.trim();

// Load the NoFlo graph based on the FBP string
noflo.graph.loadFBP(fbp, function (graph) {

  // Run the graph
  noflo.createNetwork(graph);
});
```
```coffeescript
# Get the FBP contents
fbp = document.getElementById('main').textContent.trim()

# Load the NoFlo graph based on the FBP string
noflo.graph.loadFBP fbp, (graph) ->
  # Run the graph
  noflo.createNetwork graph
```
