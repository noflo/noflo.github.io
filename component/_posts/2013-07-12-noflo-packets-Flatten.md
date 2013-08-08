---
  title: "Flatten"
  library: "noflo-packets"
  layout: "component"

---

```coffeescript
noflo = require("noflo")
_ = require("underscore")

class Flatten extends noflo.Component

  description: "Flatten the IP structure but preserve all groups (i.e.
    all groups are at the top level)"

  constructor: ->
    @inPorts =
      in: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.in.on "connect", =>
      @groups = []
      @cache = []

    @inPorts.in.on "begingroup", (group) =>
      loc = @locate()
      loc[group] = []
      @groups.push(group)

    @inPorts.in.on "data", (data) =>
      loc = @locate()
      loc.push(data)

    @inPorts.in.on "endgroup", (group) =>
      @groups.pop()

    @inPorts.in.on "disconnect", =>
      { packets, nodes } = @flatten @cache
      @flush _.extend packets, nodes
      @outPorts.out.disconnect()

  locate: ->
    _.reduce @groups, ((loc, group) -> loc[group]), @cache

  flatten: (node) ->
    groups = @getNonArrayKeys node

    if groups.length is 0
      packets: node
      nodes: {}

    else
      subnodes = {}

      for group in groups
        { packets, nodes } = @flatten node[group]
        delete node[group]
        subnodes[group] = packets
        _.extend subnodes, nodes

      packets: node
      nodes: subnodes

  getNonArrayKeys: (node) ->
    _.compact _.filter _.keys(node), (key) -> isNaN parseInt key

  flush: (node) ->
    for packet in node
      @outPorts.out.send(packet)

    for group in @getNonArrayKeys(node)
      @outPorts.out.beginGroup group
      @flush node[group]
      @outPorts.out.endGroup()

exports.getComponent = -> new Flatten

```