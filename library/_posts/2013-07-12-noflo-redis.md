---
  title: "noflo-redis"
  description: "Redis components for the NoFlo flow-based programming environment"
  author: "Henri Bergius <henri.bergius@iki.fi>"
  version: "0.0.4"
  layout: "library"

---
Redis components for NoFlo [![Build Status](https://secure.travis-ci.org/bergie/noflo-redis.png?branch=master)](https://travis-ci.org/bergie/noflo-redis)
=========================

This module provides components for the [NoFlo](http://noflojs.org/) flow-based programming framework to deal with the [Redis](http://redis.io/) database.

* Get: get value of a key stored in Redis
* Set: store a key-value pair to Redis
* Subscribe: subscribe to a regular or a wildcard (`*`) Redis channel
* Publish: send a message to a Redis channel
