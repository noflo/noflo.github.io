---
  title: "TupleToArray"
  library: "noflo-adapters"
  layout: "component"

---

```coffeescript
EXPORT=ARRAYIFY.IN:IN
EXPORT=ARRAYIFY.OUT:OUT

',' -> DELIMITER Arrayify(adapters/StringToArray)

```