---
  title: "JsonToPackets"
  library: "noflo-pgorm"
  layout: "component"

---

```coffeescript
EXPORT=EXTRACTROW.IN:IN
EXPORT=PACKETIZE.OUT:OUT
EXPORT=SENDFILTER.IN:FILTER

```
Filter output


```coffeescript
'true' -> RECURSE FilterAttributes(objects/FilterProperty)
'^_.+' -> WITH SendFilter(packets/SendWith) OUT -> KEY FilterAttributes()

```
Actual packetizing


```coffeescript
'out' -> KEY ExtractRow(objects/ExtractProperty)
'_type' -> PROPERTY GroupByType(underscore/GroupBy)
ExtractRow() OUT -> IN ParseRows(strings/ParseJson) OUT -> IN GroupByType() OUT -> IN FilterAttributes() OUT -> IN Packetize(adapters/ObjectToPackets)

```