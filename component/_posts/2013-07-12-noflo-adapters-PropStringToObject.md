---
  title: "PropStringToObject"
  library: "noflo-adapters"
  layout: "component"

---

```coffeescript
EXPORT=SPLITHASHES.IN:IN
EXPORT=PAIRSTOOBJECT.OUT:OUT

',' -> DELIMITER SplitHashes(SplitStr)
'=' -> DELIMITER SplitKeyValues(SplitStr)

SplitHashes() OUT -> IN SplitKeyValues() OUT -> IN PairsToObject(adapters/PairsToObject)

```