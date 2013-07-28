---
  title: "Responder"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
EXPORT=INPUT.IN:IN
EXPORT=MISSING.IN:MISSING

```
Normal responses

Set status code

```coffeescript
'200' -> DEFAULT SetStatusCode(packets/Defaults)
'status' -> REGEXP FilterStatus(groups/FilterByGroup)
Input(swiss/Hub) OUT -> IN FilterStatus() OUT -> IN SetStatusCode() OUT -> STRING StatusCode(SendString)

```
Set headers

```coffeescript
'headers' -> REGEXP FilterHeaders(groups/FilterByGroup)
Input(swiss/Hub) OUT -> IN FilterHeaders() OUT -> IN ObjectifyHeaders(adapters/PacketsToObject) OUT -> IN SplitHeaders(Split) OUT -> HEADERS WriteHead(webserver/WriteHead)
SplitHeaders() OUT -> IN StatusCode() OUT -> STATUS WriteHead()
SplitHeaders() OUT -> READY CacheResponse(flow/Cache)

```
Take out the response object

```coffeescript
'response' -> REGEXP FilterResponse(groups/FilterByGroup)
Input(swiss/Hub) OUT -> IN FilterResponse()

```
Prepare the response for return

```coffeescript
'res' -> GROUP GroupResponse(Group)
'res' -> REGEXP ObjectifyResponse(groups/ObjectifyByGroup)
FilterResponse() OUT -> IN GroupResponse() OUT -> IN ObjectifyResponse() OUT -> IN CacheResponse(flow/Cache)

```
The return payload

```coffeescript
CacheResponse() OUT -> IN WriteHead() OUT -> IN WriteResponse(webserver/WriteResponse) OUT -> IN SendResponse(webserver/SendResponse)

```
Prepare the body for return

```coffeescript
'true' -> RAW JsonifyOutput(strings/Jsonify)
'body' -> REGEXP FilterBody(groups/FilterByGroup)
Input() OUT -> IN FilterBody() OUT -> IN Body(Merge)
FilterBody() EMPTY -> IN Body()
Body() OUT -> IN JsonifyOutput() OUT -> STRING WriteResponse()

```
Missing responses


```coffeescript
'response' -> REGEXP FilterMissingResponse(groups/FilterByGroup)
Missing(swiss/Hub) OUT -> IN FilterMissingResponse()

'404' -> STATUS SetErrorCode(webserver/WriteHead)

'res' -> GROUP GroupMissingResponse(Group)
'res' -> REGEXP ObjectifyMissingResponse(groups/ObjectifyByGroup)
FilterMissingResponse() OUT -> IN GroupMissingResponse() OUT -> IN ObjectifyMissingResponse() OUT -> IN SetErrorCode() OUT -> IN WriteMissingResponse(webserver/WriteResponse) OUT -> IN SendMissingResponse(webserver/SendResponse)

'body' -> REGEXP FilterMissingBody(groups/FilterByGroup)
Missing() OUT -> IN FilterMissingBody() OUT -> IN MissingBody(Merge)
FilterMissingBody() EMPTY -> IN MissingBody()
MissingBody() OUT -> IN JsonifyMissingJson(strings/Jsonify) OUT -> STRING WriteMissingResponse()

```