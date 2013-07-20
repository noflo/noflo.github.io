---
  title: "Sql"
  library: "noflo-pg"
  layout: "component"

---

    EXPORT=SANITIZE.IN:IN
    EXPORT=BUILD.OUT:OUT
    EXPORT=BUILD.SQL:TEMPLATE
    

Prepend keys with ampersand for `Build`

    '^([^&][^:]*)$=&$1' -> REGEXP MapGroup(MapGroup)
    Sanitize(pg/Sanitize) OUT -> IN MapGroup() OUT -> IN Build(pg/Build)
    
