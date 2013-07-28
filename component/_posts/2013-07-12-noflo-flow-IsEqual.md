---
  title: "IsEqual"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
EXPORT=INPUTSPLIT.IN:IN
EXPORT=YES.OUT:YES
EXPORT=NO.OUT:NO

'false' -> STREAM IsEqual(swiss/Underscore)
'isEqual' -> NAME IsEqual(swiss/Underscore)
'true=0,false=1' -> MATCHES Escrow(flow/Escrow)

InputSplit(Split) OUT -> IN Escrow()
InputSplit() OUT -> IN IsEqual() OUT -> SIGNAL Escrow()

Escrow() OUT -> IN Yes(Repeat)
Escrow() OUT -> IN No(Repeat)

```