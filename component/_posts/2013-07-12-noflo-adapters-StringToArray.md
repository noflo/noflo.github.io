---
  title: "StringToArray"
  library: "noflo-adapters"
  layout: "component"

---

    EXPORT=SPLITSTR.IN:IN
    EXPORT=SPLITSTR.DELIMITER:DELIMITER
    EXPORT=ARRAYIFY.OUT:OUT
    
    SplitStr(SplitStr) OUT -> IN Arrayify(adapters/PacketsToArray)
    
