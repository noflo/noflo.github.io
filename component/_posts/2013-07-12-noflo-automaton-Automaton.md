---
  title: "Automaton"
  library: "noflo-automaton"
  layout: "component"

---

```coffeescript
EXPORT=SETUP.URL:URL
EXPORT=SETUP.RULES:RULES
EXPORT=SETUP.OPTIONS:OPTIONS
EXPORT=RUN.OUT:OUT
EXPORT=SETUP.ERROR:ERROR
 
```
The looper

```coffeescript
 
Setup(automaton/Setup) OUT -> IN Iterate(automaton/Iterate) OUT -> IN TestEffects(automaton/TestEffects) OUT -> IN TestActions(automaton/TestActions)
TestActions() OUT -> IN Iterate() RUN -> IN Run(automaton/Run)
 
```
Various action runners

```coffeescript
 
TestActions() ACTION -> IN Click(automaton/Click) OUT -> IN Fill(automaton/Fill) OUT -> IN Extract(automaton/Extract) OUT -> IN Value(automaton/Value) OUT -> IN Wait(automaton/Wait) OUT -> IN Capture(automaton/Capture) OUT -> IN Output(automaton/Output) OUT -> IN Missing(automaton/Missing)

```