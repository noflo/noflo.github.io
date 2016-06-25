---
layout: documentation
title: Debugging
---

common errors:

- when you're sending/getting from an invalid/non-existant port
- when you're attaching/detaching incorrectly
- when you don't have an error port
- when you use external component libraries, make sure they are using the latest noflo version or you may experience unexpected results
- component syntax is invalid, should use lint
- when you cannot tell whether why your component isn't getting past its precondition, console.log the buffer helpers so you know what packets are coming in.
- when things are getting stuck somewhere along the graph, try flowtrace
-
