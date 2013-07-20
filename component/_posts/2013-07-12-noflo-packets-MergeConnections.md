---
  title: "MergeConnections"
  library: "noflo-packets"
  layout: "component"

---

    EXPORT=MERGE.IN:IN
    EXPORT=FLATTEN.OUT:OUT
    
    Merge(Merge) OUT -> IN Flatten(packets/Flatten)
    
