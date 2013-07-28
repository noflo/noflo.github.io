---
  title: "StringifyUrl"
  library: "noflo-woute"
  layout: "component"

---

```coffeescript
EXPORT=STRINGIFYURL.IN:IN
EXPORT=STRINGIFYURL.OUT:OUT

'/' -> DELIMITER StringifyUrl(adapters/PacketsToString)

```