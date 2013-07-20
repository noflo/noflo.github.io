---
  title: "noflo-compare"
  description: "Performing Comparisons in NoFlo"
  author: "Kenneth Kan <kenhkan@gmail.com>"
  version: "0.0.5"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-compare"
  layout: "library"

---
Performing Comparisons in NoFlo [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-compare.png?branch=master)](https://travis-ci.org/kenhkan/noflo-compare)
===============================

This package provides utility components to compare between two or more
connections within a [NoFlo](http://noflojs.org/) program.

Feel free to contribute new components and graphs! I'll try to
incorporate as soon as time allows.


Usage
-------------------------------

### AllPackets ###

Accept two streams of packets. Only the one with packets "winning" the
packets of the other stream gets passed to the 'OUT' port.

The comparison is done on a packet-to-packet basis. For instance, for
the following streams,

    First Stream: C, D, 3, H
    Second Stream: A, B, 4, G

The first stream would win because `C > A`, `D > B`, and `H > G` even
though `3 < 4`. The stream with the most winning packets gets forwarded.

If the number of packets doesn't match, comparison would be performed
only up to the last packet of the shorter stream. For instance,

    First Stream: C, D, 3, H
    Second Stream: A, B, 4, G, Z, Z, Z, Z

Only the first four are compared and the result is the same as before.

#### In-ports

  * IN: streams of packets to be compared

#### Out-ports

  * OUT: the winning stream of the couple of streams passed to 'IN'

#### Examples

Compare two streams and output the first one.

    'C\nD\n3\nH\nZ\nZ' -> IN SplitA(core/SplitStr) OUT -> IN AllPackets(compare/AllPackets)
    'A\nB\n4\nG' -> IN SplitB(core/SplitStr) OUT -> IN AllPackets() OUT -> IN Output(core/Output)
