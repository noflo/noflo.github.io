---
  title: "noflo-woute"
  description: "Routing web requests based on the request's URL"
  author: 
    name: "Kenneth Kan"
    email: "kenhkan@gmail.com"
    avatar: "http://www.gravatar.com/avatar/3db61a4a42000b4ff62648c0979e8920?s=23"
  version: "0.1.1"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-woute"
  layout: "library"

---
# Woute: A Web Request Router <br/>[![Build Status](https://secure.travis-ci.org/kenhkan/noflo-woute.png?branch=master)](https://travis-ci.org/kenhkan/noflo-woute) [![Dependency Status](https://gemnasium.com/kenhkan/noflo-woute.png)](https://gemnasium.com/kenhkan/noflo-woute) [![NPM version](https://badge.fury.io/js/noflo-woute.png)](http://badge.fury.io/js/noflo-woute) [![Stories in Ready](https://badge.waffle.io/kenhkan/noflo-woute.png)](http://waffle.io/kenhkan/noflo-woute)

The most natural way to route web requests is to use matching rules, not unlike
[Sinatra](http://www.sinatrarb.com/) in Ruby and
[Express](http://expressjs.com/) in JavaScript.

However, in NoFlo, it's a network of blackboxes you connect to make a program.
The intuitive way is to connect incoming requests to a series of matchers;
failure to match forwards to the next matcher.

When successful matches occur, the request is sent to wherever the programmer
wants, which hopefully produces some result to be sent to a responder. An
abstract example would be:

    
                           /login                /get_images
                             +                      +
                             |                      |
                             |                      |
    +-----------+        +---v-------+         +----v------+           +------------+
    |           |        |           |         |           |           |            |
    |           |  Req   |  First    |  Fail   |  Second   |  Fail     |  Third     |
    | Webserver +-------->  Matcher  +--------->  Matcher  +----------->  Matcher   |
    |           |        |           |         |           |           |            |
    +-----------+        +---+-------+         +----+------+           +---+--------+
                             |                      |                      |
                             |Success               |Success               |Success
                             |                      |                      |
                         +---v-------+         +----v------+           +---v--------+
                         |           |         |           |           |            |
                         |           |         |           |           |            |
                         |           |         | Fetch     |           |            |
                         | Login     |         | Images    |           | 404        |
                         |           |         |           |           |            |
                         +-----+-----+         +----+------+           +---+--------+
                               |                    |                      |
                               |                    |Res                   |
                               |Res                 |                      |Res
                               |               +----v------+               |
                               |               |           |               |
                               +--------------->           <---------------+
                                               | Respond   |
                                               |           |
                                               +-----------+


## Installation

    npm install --save noflo-woute


## Quick & Dirty Usage

To use noflo-woute in its most basic form, you only need the `Matcher`
component:

* Inport `MATCH`: *optional* takes a URL segment to match. Default to always
  match
* Inport `METHOD`: *optional* an HTTP method. Default to any method
* Inport `IN`: takes a request/response pair produced by
  [noflo-webserver](https://github.com/noflo/noflo-webserver)
* Outport `OUT`: the request/repsonse pair if match is successful
* Outport `FAIL`: the request/response pair if match is unsuccessful, most
  likely attached to another matcher

Simply connect some matchers together like the abstract example shown above and
you're good to go!


## More Advanced Usage: Adapters

Matchers are agnostic to the actual request/response, meaning that whoever
handling a successfully matched case is handed the same thing that they would
get from noflo-webserver. Two pairs of adapter components are there to help you
to "split" the request into different parts so manipulation is easier:
`woute/ToGroups`, `woute/ToPorts`, and their other halves `woute/FromGroups`
and `woute/FromPorts`.

Both adapter pairs break the request/response object into these parts:

* `url`: ditto
* `headers`: the HTTP headers broken down into pairs (as an object of headers)
* `query`: the query string broken down into pairs (as an object of queries)
* `body`: the body passed through as-is (i.e. always a string)
* `request`: the request/response object

`ToGroups` converts the incoming request/response object into the listed parts
grouped by the names. Groups are constructed and sent in the order of the list
above. `ToPorts` converts the object into the parts via ports by those names.

For instance, out comes from port `ToGroups` within a single connection:

    BEGINGROUP: URL
    DATA: /login
    ENDGROUP: URL
    BEGINGROUP: HEADERS
    DATA: { "x-http-destination": "NoFlo Awesomeness" }
    ENDGROUP: HEADERS
    BEGINGROUP: QUERY
    DATA: { this: "is sent", as: "an object" }
    ENDGROUP: QUERY
    BEGINGROUP: BODY
    DATA: {"this":[{"is":"JSON","but":"is"},{"still":"sent"}],"as":"a string"}
    ENDGROUP: BODY
    BEGINGROUP: REQUEST
    DATA: <The request/response object>
    ENDGROUP: REQUEST

For `ToPorts`, the same data packets would be sent to ports `URL`, `HEADERS`,
`QUERY`, `BODY`, and `REQUEST`, respectively. Both `ToGroups` and `ToPorts`
retain all the groups emitted from noflo-webserver.

### Preparing for response

When you are done and are ready to send back a response, remember to feed your
content to these two components' significant others: `woute/FromGroups` and
`woute/FromPorts`. These two components take the disassembled data packets,
apply them on a response object, and splice the connection back into
request/repsonse pair so it's ready to be sent to
[webserver/SendResponse](https://github.com/noflo/noflo-webserver/blob/master/components/SendResponse.coffee).

The components take these types of data packets:

* `status`: the status code to set
* `headers`: the response headers to be sent back
* `body`: the body to be sent back
* `request`: the request/response object

### Which way is best?

`ToPorts` makes the HTTP request much more manageable as it breaks down the
main parts of an HTTP request into separate connections. However, there is a
down side: you need to be careful when asynchronous operation is involved.

Asynchronous operation removes a connection on a port from another, rendering
`FromPorts` unable to splice them back into a request/response object. Yes,
noflo-webserver does wrap the request around with a unique UUID for
identification of a single HTTP request, but noflo-woute ignores that (but
still retains it as a group). It is the responsibility of the programmer or a
different package built on top of noflo-woute to handle asynchronicity.

Also, `ToPorts` triggers the re-assembly of the request/response object as soon
as it receives a request/response object because it would otherwise not know
when to apply the content of the packets on the response object. This means
that anything that is sent after the request/response object is received is
ignored.

`ToGroups` on the other hand puts everything within the same connection so
there isn't any synchronicity problem as you pass the entire object around all
at once. However, every time you need to find what you want and manipulate it,
you need to weed through all the groups. Both approaches have pros and cons,
hence the options.


## Gotchas

* In order for noflo-woute to recognize the `BODY` part, you need to run the
  request through
  [webserver/BodyParser](https://github.com/noflo/noflo-webserver/blob/master/components/BodyParser.coffee)
* `FromPorts` and `FromGroups` both expect the incoming body to be a string.
  You must JSONify or perform any conversion before feeding the body to the two
  components.
* Remember to apply any desired
  [middleware](https://github.com/noflo/noflo-webserver/tree/master/components)
  before passing the request/response object to any matcher.


## Examples

### Echo Server

Run the server:

    > cd examples/echo_server
    > npm install
    > npm run-script main

Get back exactly what you pass in:

    > curl "http://localhost:1337/echo" -d '{"a":"b"}' -H "Content-Type: application/json"
    {"a":"b"}

Get back the string 'empty-body':

    > curl "http://localhost:1337/empty-body" -d '{"a":"b"}' -H "Content-Type: application/json"
    empty-body

Print to console of incoming body, but get nothing in return:

    > curl "http://localhost:1337/anything-here" -X POST -d '{"a":"b"}' -H "Content-Type: application/json"

File not found:

    > curl "http://localhost:1337/abc" -I
    HTTP/1.1 404 Not Found
    Date: Sat, 10 Aug 2013 08:35:04 GMT
    Connection: keep-alive

To look at how these work, read the [FBP code](https://github.com/kenhkan/noflo-woute/blob/master/examples/echo_server/graphs/main.fbp).
