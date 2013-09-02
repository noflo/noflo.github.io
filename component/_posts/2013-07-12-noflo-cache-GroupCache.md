---
  title: "GroupCache"
  library: "noflo-cache"
  layout: "component"

---

```coffeescript
EXPORT=INPUT.IN:IN
EXPORT=CACHE.OUT:OUT
EXPORT=CACHE.FLUSH:READY

'true' -> KEEP Cache(cache/Cache)

Input(swiss/Hub) OUT -> IN ReadGroups(groups/ReadGroups) OUT -> IN DropGroupsOut(Drop)
ReadGroups() GROUP -> IN Group(Split)

Group() OUT -> KEY Cache()
Group() OUT -> GROUP Regroup(groups/Group) OUT -> IN Cache()
Group() OUT -> REGEXP Filter(groups/FilterByGroup)
Input() OUT -> IN Filter() OUT -> IN Regroup()

```