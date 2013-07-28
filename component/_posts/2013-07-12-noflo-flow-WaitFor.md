---
  title: "WaitFor"
  library: "noflo-flow"
  layout: "component"

---

```coffeescript
EXPORT=CACHE.IN:IN
EXPORT=COUNTDOWN.COUNT:COUNT
EXPORT=COUNTDOWN.IN:READY
EXPORT=CACHE.OUT:OUT

CountDown(flow/CountDown) OUT -> READY Cache(flow/Cache)

```