---
  title: "Spring"
  library: "noflo-physics"
  layout: "component"

---

```coffeescript
if typeof process is 'object' and process.title is 'node'
  noflo = require "noflo"
  requestAnimFrame = process.nextTick
else
  noflo = require 'noflo'
  requestAnimFrame = window.requestAnimationFrame or
    window.webkitRequestAnimationFrame or
    window.mozRequestAnimationFrame or
    (callback) -> setTimeout callback, 1

class Spring extends noflo.Component
  description: 'Animates a directional spring'
  constructor: ->
```
Initial locations. Anchor is the fixed point
at the other end of the spring, and massPosition
is the moving bit in the end

```coffeescript
    @massPosition = 0
    @anchorPosition = 0

```
Tunable parameters for spring behaviour

```coffeescript
    @stiffness = 120
    @mass = 10
    @friction = 3

```
We start with no motion

```coffeescript
    @speed = 0

    @inPorts =
      anchor: new noflo.Port 'number'
      in: new noflo.Port 'number'
      stiffness: new noflo.Port 'int'
      mass: new noflo.Port 'int'
      friction: new noflo.Port 'int'
    @outPorts =
      out: new noflo.Port 'number'
 
    @inPorts.anchor.on 'data', (@anchorPosition) =>
    @inPorts.stiffness.on 'data', (@stiffness) =>
    @inPorts.mass.on 'data', (@mass) =>
    @inPorts.friction.on 'data', (@friction) =>
    @inPorts.in.on 'data', (@massPosition) =>
      @step()

  step: =>
    distance = @massPosition - @anchorPosition

```
Forces applying to the spring

```coffeescript
    dampingForce = -@friction * @speed
    springForce = -@stiffness * distance
    totalForce = springForce + dampingForce
   
```
Count the new speed of movement

```coffeescript
    acceleration = totalForce / @mass
    @speed += acceleration

    previousPosition = @massPosition

```
Calculate where we've moved

```coffeescript
    @massPosition += @speed / 100

    if Math.round(@massPosition) isnt Math.round(previousPosition)
```
Send the new position out

```coffeescript
      @outPorts.out.send Math.round @massPosition

    if Math.round(@massPosition) is @anchorPosition and
    Math.abs(@speed) < 0.2
```
The spring is back at rest

```coffeescript
      @outPorts.out.disconnect()
    else
```
And yet it moves

```coffeescript
      return if @massPosition is 0
      requestAnimFrame @step

exports.getComponent = -> new Spring

```