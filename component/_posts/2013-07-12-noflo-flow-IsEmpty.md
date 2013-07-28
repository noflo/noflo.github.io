---
  title: "IsEmpty"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
EXPORT=INPUTSPLIT.IN:IN
EXPORT=YES.OUT:YES
EXPORT=NO.OUT:NO

'isEmpty' -> NAME IsEmpty(swiss/Underscore)
'true=0,false=1' -> MATCHES Escrow(flow/Escrow)

InputSplit(Split) OUT -> IN Escrow()
InputSplit() OUT -> IN IsEmpty() OUT -> SIGNAL Escrow()

Escrow() OUT -> IN Yes(Repeat)
Escrow() OUT -> IN No(Repeat)

```