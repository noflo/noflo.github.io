---
  title: "ExtractHashValue"
  library: "noflo-groups"
  layout: "component"

---

    EXPORT=KEY.IN:IN
    EXPORT=KEY.GROUP:GROUP
    EXPORT=VALUE.OUT:OUT
    
    Group(ReadGroup) OUT -> IN SliceSplit(Split)
    
    SliceSplit() OUT -> IN WaitForPattern(flow/Cache) OUT -> IN Filter(FilterString) OUT -> IN Value(Replace)
    SliceSplit() OUT -> READY WaitForGroup(flow/Cache)
    
    '$1' -> REPLACEMENT Value()
    '%key' -> PATTERN Pattern(Replace)
    '^%key:(.+)' -> IN WaitForKey(flow/Cache) OUT -> IN Pattern() OUT -> IN WaitForGroup() OUT -> IN Split(Split)
    Key(Split) OUT -> REPLACEMENT Pattern()
    Key() OUT -> READY WaitForKey()
    
    Split() OUT -> PATTERN Filter()
    Split() OUT -> PATTERN Value()
    Split() OUT -> READY WaitForPattern()
    
