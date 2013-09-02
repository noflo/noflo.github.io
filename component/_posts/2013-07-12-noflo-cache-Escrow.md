---
  title: "Escrow"
  library: "noflo-cache"
  layout: "component"

---

```coffeescript
EXPORT=FORK.IN:IN
EXPORT=MATCHES.IN:SIGNAL
EXPORT=FORK.OUT:OUT
EXPORT=PROPSTRINGTOOBJECT.IN:MATCHES

PropStringToObject(adapters/PropStringToObject) OUT -> MATCH Matches(strings/MatchReplace) OUT -> PORT Fork(flow/Fork)

```