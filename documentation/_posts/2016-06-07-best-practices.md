---
layout: documentation
title: Best Practices
---

### Component Best Practices

* When defining ports, set `required: true` on ports that are required, then all other ports are implicitly `required: false` '(When there is only one in port or output (and it is not a generator), they are implicitly true)
* Use process api
