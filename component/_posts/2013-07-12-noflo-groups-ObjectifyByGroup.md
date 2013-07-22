---
  title: "ObjectifyByGroup"
  library: "noflo-groups"
  layout: "component"

---

    EXPORT=OBJECTIFY.IN:IN
    EXPORT=REMOVE.OUT:OUT
    EXPORT=REGEXP.IN:REGEXP
    
    Regexp(Split) OUT -> REGEXP Objectify(groups/Objectify) OUT -> IN Remove(groups/RemoveGroups)
    Regexp() OUT -> REGEXP Remove()
    
