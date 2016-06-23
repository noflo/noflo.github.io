---
layout: documentation
title: NoFlo graph file format
---
In addition to using NoFlo in _embedded mode_ where you create the FBP graph programmatically ([see example](https://raw.github.com/noflo/noflo/master/examples/linecount/count.coffee)), you can also initialize and run graphs defined using a JSON file.

The NoFlo JSON files declare the processes used in the FBP graph, and the connections between them. They look like the following:

```json
{
  "properties": {
    "name": "Count lines in a file"
  },
  "processes": {
    "Read File": {
      "component": "ReadFile",
      "metadata": {
        ...
      }
    },
    "Split by Lines": {
      "component": "SplitStr"
    },
    ...
  },
  "connections": [
    {
      "data": "package.json",
      "tgt": {
        "process": "Read File",
        "port": "source"
      }
    },
    {
      "src": {
        "process": "Read File",
        "port": "out"
      },
      "tgt": {
        "process": "Split by Lines",
        "port": "in"
      }
    },
    ...
  ]
}
```

To run a graph file, you can either use the _load_ command of the NoFlo shell, or do it programmatically:

```coffeescript
noflo = require "noflo"
noflo.loadFile "example.json", (network) ->
  console.log "Graph loaded"
  console.log network.graph.toDOT()
```
```javascript
var noflo = require("noflo");
noflo.loadFile("example.json", function(network) {
  console.log("Graph loaded");
  console.log(network.graph.toDOT());
});
```

Please refer to the [Graph JSON schema](https://github.com/noflo/noflo/blob/master/graph-schema.json) for a full definition.
