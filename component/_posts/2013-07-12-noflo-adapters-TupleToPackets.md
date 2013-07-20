---
  title: "TupleToPackets"
  library: "noflo-adapters"
  layout: "component"

---

    EXPORT=ARRAYIFY.IN:IN
    EXPORT=PACKETIZE.OUT:OUT
    EXPORT=DELIMITER.IN:DELIMITER
    
    ',' -> IN Delimiter(Merge) OUT -> DELIMITER Arrayify(adapters/StringToArray) OUT -> IN Packetize(adapters/ObjectToPackets)
    
