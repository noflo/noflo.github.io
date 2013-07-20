---
  title: "noflo-woute"
  description: "Routing web requests based on the request's URL"
  author: "Kenneth Kan <kenhkan@gmail.com>"
  version: "0.0.11"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-woute"
  layout: "library"

---
Routing web requests based on the request's URL [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-woute.png?branch=master)](https://travis-ci.org/kenhkan/noflo-woute)
===============================

Most of the time you want to define a bunch of URL patterns and provide
a handler for each of them, not unlike
[Sinatra](http://www.sinatrarb.com/). With Woute, you can route web
requests similar to Sintra! You simply send in an array of URL patterns
and attach handler components to it.


Usage
-------------------------------

Note: All the following examples are written in FBP.

First, set up a Woute server with an array of URL patterns, which is
based on [noflo-webserver](https://github.com/bergie/noflo-webserver):

    '8080' -> LISTEN Woute(woute/Woute)
    'a/b.+,a/c,.+' -> ROUTES Woute()

Routes are defined *at once*. The second time Woute's 'ROUTES' port
receives something, all routes would be replaced. Each data IP
represents one pattern to match.

Routes are RegExp strings that have an implied '^', meaning that the URL
must match from the beginning onward. In the example above, 'a/b.+'
matches only URL starting with 'a' then followed by any string starting
with 'b', and followed by anything afterwards. '.+' would simply match
anything that is not empty (i.e. the "home page").

Each route is then coupled with a handler that attaches to the 'OUT'
port of Woute. Coupling is done by *position* of attachment. For
instance, continuing from the above:

    Woute() OUT -> IN AB(Output)
    Woute() OUT -> IN AC(Output)
    Woute() OUT -> IN Any(Output)

If the definition is somewhat juggled around, however, like:

    'a/b.+,.+,a/c' -> ROUTES Woute(Woute)

Then you would have to write the FBP program as:

    Woute() OUT -> IN AB(Output)
    Woute() OUT -> IN Any(Output)
    Woute() OUT -> IN AC(Output)

Note: placing a '.+' route would render any routes after it never to be
reached, except of course '.\*' or ''.

Any unmatched requests are simply ignored. Therefore, it is advised to
have a '.\*' at the end of your route definition.

If you prefer to pass each route individually, you may also send the
route to the 'ROUTE' port (as opposed to the 'ROUTES' port).

    'a/b.+' -> ROUTE Woute(Woute)
    '.+' -> ROUTE Woute()
    'a/c' -> ROUTE Woute()
    Woute() OUT -> IN AB(Output)
    Woute() OUT -> IN Any(Output)
    Woute() OUT -> IN AC(Output)

#### What is passed on?

The handler with a matching URL would receive the URL, the headers, body
of the request, and also a random UUID for replying back to the client.

If the request looks like:

    GET /a/cat/something/here HTTP/1.1
    Host: example.com
    Content-Type: application/json; charset=utf-8
    Content-Length: 23

    {
      "Transaction": "OK"
    }

The handler 'AC', in the first example, would then receive:

    GROUP: session-id
      DATA: <SomeRandomSessionIDHere>
    GROUP: url
      DATA: a
      DATA: cat
      DATA: something
      DATA: here
    GROUP: headers
      DATA: {
        Host: example.com
        Content-Type: application/json; charset=utf-8
        Content-Length: 23
      }
    GROUP: body
      DATA: { Transaction: "Is it OK?" }

Note that the 'body' and 'headers' data packet contains a JavaScript
object rather than a JSON string.

#### Sending back a response

Instead of sending your response to the Woute process, create a
Responder process and pass an object following the structure of that
emitted by the Woute component.

    Woute(woute/Woute) OUT -> IN Responder(woute/Responder)

Note that the 'body' and 'headers' data packet should contain a
JavaScript object rather than a JSON string.

#### Handling 404s

There is a convenient port 'MISSING' on Woute that echoes what is sent
to it but responds with status code 404. It is as easy as giving the
object emitted from 'OUT' straight to 'MISSING'.


Convenient Helpers
-------------------------------

Because Woute relies on ArrayPort to route the web requests, it is
inconvenient to output the request not as an object but via individual
ports (e.g. 'SESSIONID', 'HEADERS', 'BODY', etc) so that the user of
this module must attach to each port for each handler in the proper
order.

Instead, two helpers are provided to convert the objects into packets
via ports. These helpers may be applied after the routing is complete.
For example:

    '8080' -> LISTEN Woute(woute/Woute)
    'a,b,c' -> ROUTES Woute()
    Woute() OUT -> IN DecompressA(woute/Decompress) ...
    Woute() OUT -> IN DecompressB(woute/Decompress) ...
    Woute() OUT -> IN DecompressC(woute/Decompress) ...

#### Decompress

The Decompress graph takes the output of Woute (i.e. the request object)
and isolate each group into its own connection (less the group itself)
via the corresponding port. Currently, these ports are supported:

  * RESPONSE
  * HEADERS
  * TOKEN
  * OUT

And these ports are not available in Compress:

  * QUERY
  * URL

The TOKEN port outputs the session ID whereas the OUT port emits the
body of the request.

#### Compress

The Compress graph does the opposite of Decompress. It takes the same
four ports as in-ports and outputs an object that Woute then takes to
respond to client.
