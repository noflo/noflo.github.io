---
layout: documentation
title: Publishing component libraries
---
Developers can simply publish their own components independently without having to send pull requests to the main NoFlo repository. The same mechanism can also be used when publishing more traditional Node.js libraries to include the NoFlo components utilizing that library.

## Publishing your components

Please refer to [the NPM documentation](https://npmjs.org/doc/developers.html) on how to publish packages in general. To publish NoFlo components, you simply need to amend the `package.json` file with the NoFlo metadata to register the components you're providing, like this:

```json
{
  "noflo": {
    "components": {
      "ParseYaml": "./components/ParseYaml.coffee",
      "ToYaml": "./components/ToYaml.coffee"
    }
  },
}
```

If you're publishing FBP graphs in either [.json](https://github.com/bergie/noflo/blob/master/examples/linecount/count.json) or [.fbp](https://github.com/bergie/noflo/blob/master/examples/linecount/count.fbp) format, just provide them similarly with the `graphs` key. Components can be either in CoffeeScript or JavaScript, the NoFlo ComponentLoader will handle the coffee compilation transparently.

For examples, check out [noflo-yaml](https://github.com/bergie/noflo-yaml) or [noflo-basecamp](https://github.com/bergie/noflo-basecamp).

## Listing installed components

An additional benefit for this new structure is that now the NoFlo ComponentLoader can provide a list of installed components, which is also available on the noflo command-line. For example:

    $ noflo list ../noflo-webserver
    GroupByPacket (/home/bergie/Projects/noflo/src/components/GroupByPacket.coffee)
    Inports: in
    Outports: out
    ...
    Server (/home/bergie/Projects/noflo-webserver/components/Server.coffee)
    This component receives a port and host, and initializes a HTTP server for that combination. It sends out a request/response pair for each HTTP request it receives
    Inports: listen
    Outports: request

This same information will also be exposed to the web-based NoFlo GUI.
