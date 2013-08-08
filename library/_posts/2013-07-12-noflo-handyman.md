---
  title: "noflo-handyman"
  description: "Handy tools for debugging in NoFlo"
  author: 
    name: "Kenneth Kan"
    email: "kenhkan@gmail.com"
    avatar: "http://www.gravatar.com/avatar/3db61a4a42000b4ff62648c0979e8920?s=23"
  version: "0.0.8"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-handyman"
  layout: "library"

---
Handy tools for debugging in NoFlo [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-handyman.png?branch=master)](https://travis-ci.org/kenhkan/noflo-handyman)
===============================

This package provides various components to drop-in debugging in
[NoFlo](http://noflojs.org/).

Feel free to contribute new components and graphs! I'll try to
incorporate as soon as time allows.


Usage
-------------------------------

### Quit ###

Quit the Node.js process.

#### In-ports

  * IN: everything is dropped and call `process.exit` upon disconnect.

#### Out-ports

  * OUT: no data packets are emitted. This is simply here for drop-in
    use of this component.

#### Examples

Quit the process.

    'whatever' -> IN Quit(handyman/Quit) OUT -> IN NotReceivingIt(core/Output)


### Log ###

Output all connect, begingroup, data, endgroup, and disconnect signals
to screen in a formatted manner. Because NoFlo passes packets of all
kinds immediately for performance (i.e. all the begingroups would be
emitted before the data packets enclosed by the begingroups are
emitted), The entire stream of packets passing through a particular
process isn't conclusive until all packets are sent.

Therefore, if you place an 'Output' component after a 'Log' component,
data packets passing through 'Output' will always be displayed on screen
before anything emitted from/to the 'Log' component is displayed.
However, 'Log' displays all packets in the appropriate order when other
'Log' processes are involved.

'Log' also distinguishes between "streams". A packet passing through two
distinct 'Log' processes share a stream when it passes the processes
before the whole flow of packets completes. For instance,

    'X' -> IN A(handyman/Log) OUT -> IN Repeat(core/Repeat) OUT -> IN B(handyman/Log)

'X' is displayed twice because it passes through both processes 'A' and
'B' and it is grouped in a single stream. However, if...

    'Y' -> IN A(handyman/Log) OUT -> IN Repeat(core/RepeatAsync) OUT -> IN B(handyman/Log)

'Y' is still displayed twice becauses it passes through the two
processes but it's displayed separately in two streams because there is
an asynchronous operation in the middle and the flow completes at the
'Repeat' process.

#### In-ports

  * IN: anything that will be displayed on screen.
  * OPTIONS: an object to be passed to
    [`util.inspect`](http://nodejs.org/docs/latest/api/util.html#util_util_inspect_object_options)

#### Out-ports

  * OUT: if attached, everything from 'IN' will be forwarded to this
    port.

#### Examples

Print:
```
------------ STREAM ------------
-
-       CONNECT | 
-    BEGINGROUP | Group
-          DATA | 'Data'
-      ENDGROUP | Group
-    DISCONNECT | 
-
-       CONNECT | 
-    BEGINGROUP | Group
-          DATA | 'Data'
-      ENDGROUP | Group
-    DISCONNECT | 
-
--------------------------------
```

    'Group' -> GROUP Group(core/Group)
    'Data' -> IN Group() OUT -> IN A(handyman/Log) OUT -> IN Repeat(core/Repeat) OUT -> IN B(handyman/Log)

Print:
```
------------ STREAM ------------
-
-       CONNECT | 
-    BEGINGROUP | Group
-          DATA | 'Data'
-      ENDGROUP | Group
-    DISCONNECT | 
-
--------------------------------
-
-
------------ STREAM ------------
-
-       CONNECT | 
-    BEGINGROUP | Group
-          DATA | 'Data'
-      ENDGROUP | Group
-    DISCONNECT | 
-
--------------------------------
```

    'Group' -> GROUP Group(core/Group)
    'Data' -> IN Group() OUT -> IN A(handyman/Log) OUT -> IN RepeatAsync(core/RepeatAsync) OUT -> IN B(handyman/Log)
