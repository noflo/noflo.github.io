---
  title: "noflo-adapters"
  description: "Packet Format Conversion for NoFlo"
  author: "Kenneth Kan <kenhkan@gmail.com>"
  version: "0.0.6"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-adapters"
  layout: "library"

---
Packet Format Conversion for NoFlo [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-adapters.png?branch=master)](https://travis-ci.org/kenhkan/noflo-adapters)
===============================

This package provides various components to convert packets from one
format to another in [NoFlo](http://noflojs.org/).

Feel free to contribute new components and graphs! I'll try to
incorporate as soon as time allows.


Usage
-------------------------------

### ObjectToPackets ###

Convert a packet that is an object into grouped packets.

#### In-ports

  * IN: a packet that is an object
  * DEPTH: how many levels to parse in the provided object

#### Out-ports

  * OUT: grouped packets

#### Examples

Convert objects to packets.

    'whatever' -> IN Quit(handyman/Quit) OUT -> IN NotReceivingIt(core/Output)
