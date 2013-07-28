---
  title: "ConstructRead"
  library: "noflo-pgorm"
  layout: "component"

---

```coffeescript
_ = require("underscore")
_s = require("underscore.string")
noflo = require("noflo")

class ConstructRead extends noflo.Component

  description: _s.clean "Construct SQL template and values from provided
  tables and constraints"

  constructor: ->
    @pkey = "id"
    @offset = 0
    @limit = 50
    @orderBy = "id ASC"

    @inPorts =
      in: new noflo.Port
      pkey: new noflo.Port
      limit: new noflo.Port
      offset: new noflo.Port
      orderby: new noflo.Port
    @outPorts =
      template: new noflo.Port
      out: new noflo.Port

    @inPorts.pkey.on "data", (@pkey) =>
      @orderBy = "#{@pkey} ASC" if @orderBy is "id ASC"
    @inPorts.limit.on "data", (@limit) =>
    @inPorts.offset.on "data", (@offset) =>
    @inPorts.orderby.on "data", (@orderBy) =>

    @inPorts.in.on "connect", =>
      @count = 0
      @tables = []
      @constraints = []
      @groups = []

    @inPorts.in.on "begingroup", (table) =>
      @groups.push table
      tables = @tables[@count] ?= []
      tables.push table
 
    @inPorts.in.on "data", (constraint) =>
      constraints = @constraints[@count] ?= []
      constraints.push constraint if _.isArray constraint

    @inPorts.in.on "endgroup", (table) =>
      @groups.pop()
      @count++ if _.isEmpty @groups

    @inPorts.in.on "disconnect", =>
      templates = []
      values = []

      for i in [0...@count]
        tables = @tables[i]
        constraints = @constraints[i]

        templates.push @constructTemplate tables, constraints
        values.push @constructValues tables, constraints

      @outPorts.template.send _s.clean """
        SELECT row_to_json(rows) AS out FROM (
          #{templates.join(" UNION ")}
        ) AS rows;
      """
      @outPorts.template.disconnect()

      if _.all values, _.isEmpty
        @outPorts.out.send null
      else
        for value in values
          for column, vs of value
            @outPorts.out.beginGroup column
            @outPorts.out.send v for v in vs
            @outPorts.out.endGroup()
      @outPorts.out.disconnect()

  constructPlaceholder: (table, key, id = "", prefix = "&") ->
    "#{prefix}#{table}_#{key}_#{id}"

  constructTemplate: (tables, constraints) ->
    primary = _.first tables
    tables = tables.join ", "
    fields = "#{primary}.*, '#{primary}' AS _type"
    baseClause = "SELECT DISTINCT ON (#{@pkey}) #{fields} FROM #{tables}"
    constraintClause = ""
    optionsClause = " ORDER BY #{@pkey}, #{@orderBy}"
    optionsClause += " LIMIT #{@limit} OFFSET #{@offset}"

    constStrings = []
    for constraint in constraints
      [column, operator, value...] = constraint
      placeholder = @constructPlaceholder primary, column
      constStrings.push "#{column} #{operator.toUpperCase()} #{placeholder}"

    if constStrings.length > 0
      constraintClause = " WHERE #{constStrings.join(" AND ")}"

    template = "#{baseClause}#{constraintClause}#{optionsClause}"
    "(SELECT rows FROM (#{template}) AS rows)"

  constructValues: (tables, constraints) ->
    primary = _.first tables
    values = {}

    for constraint in constraints
      [column, operator, value...] = constraint
      placeholder = @constructPlaceholder primary, column
```
Pad values for list just in case of list of one

```coffeescript
      value.push null if operator.toUpperCase() is "IN"
      values[placeholder] = value

    values

exports.getComponent = -> new ConstructRead

```