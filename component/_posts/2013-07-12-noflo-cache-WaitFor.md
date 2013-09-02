---
  title: "WaitFor"
  library: "noflo-cache"
  layout: "component"

---

```coffeescript
EXPORT=CACHE.IN:IN
EXPORT=COUNTDOWN.COUNT:COUNT
EXPORT=COUNTDOWN.IN:READY
EXPORT=CACHE.OUT:OUT

CountDown(flow/CountDown) OUT -> READY Cache(cache/Cache)

```