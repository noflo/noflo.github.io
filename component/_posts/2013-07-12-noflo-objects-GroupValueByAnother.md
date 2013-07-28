---
  title: "GroupValueByAnother"
  library: "noflo-objects"
  layout: "component"

---

```coffeescript
EXPORT=FILTERGROUPINGVALUE.REGEXP:GROUPING
EXPORT=FILTERENCLOSEDVALUE.REGEXP:ENCLOSED
EXPORT=OBJECTS.IN:IN
EXPORT=GROUPING.OUT:OUT

Objects(objects/SplitObject) OUT -> IN GroupedValues(Split)

GroupedValues() OUT -> IN FilterGroupingValue(groups/FilterByGroup) OUT -> GROUP Grouping(groups/GroupZip)
GroupedValues() OUT -> IN FilterEnclosedValue(groups/FilterByGroup) OUT -> IN Grouping()

```