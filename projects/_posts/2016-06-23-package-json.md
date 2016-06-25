---
layout: projects
title: Project.json
categories:
  - projects
weight: 8
---

Since `JSON` does not support comments, we can break down the parts of package.json that are important to noflo here:

```coffeescript
{
  # name of your project
  # this is the namespace when you are loading components or graphs
  # for example, candianness/DetermineEmotion
  "name": "canadianness",

  # including noflo in your keywords is
  # helpful for people looking for noflo packages on npm
  "keywords": [
    "noflo"
  ],

  # we want to make sure we have noflo
  # and the noflo packages we want to use in our dependencies
  "dependencies": {
    "noflo": "^0.7.8",
    "noflo-core": "^0.1.3",
  },

  # the stuff we will use in our dev environment
  # should go in devDependencies
  "devDependencies": {
    "chai": "^3.5.0",
    "coffeelint": "^1.13.0",
    "fbp-spec": "^0.1.15",
    "grunt": "^0.4.5",
    "grunt-cli": "^1.2.0",
    "grunt-coffeelint": "^0.0.13",
    "grunt-mocha-test": "^0.12.2",
    "mocha": "^2.5.3",

    # we need this for running in flowhub
    "noflo-nodejs": "^0.7.1",
    "noflo-runtime-base": "^0.7.3"
  },
  "scripts": {
    # running `npm start` will start the runtime
    # so it can be loaded in flowhub
    "start": "./node_modules/.bin/noflo-nodejs --trace --debug",
    "test": "./node_modules/.bin/grunt test"
  }
}
```

also check out [Auto-deploying to NPM using Travis](/documentation/publishing/#auto-deploying-to-npm-using-travis)

- [previous step (Embedding)](/projects/embedding)
- [next step (Summary)](/projects/summary)

