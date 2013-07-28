---
  title: "ConstructWrite"
  library: "noflo-pgorm"
  layout: "component"

---

```coffeescript
_ = require("underscore")
_s = require("underscore.string")
noflo = require("noflo")

class ConstructWrite extends noflo.Component

  description: _s.clean "Construct SQL template and values from provided
  objects"

  constructor: ->
    @pkey = "id"
    @table = null

    @inPorts =
      in: new noflo.Port
      pkey: new noflo.Port
    @outPorts =
      template: new noflo.Port
      out: new noflo.Port

    @inPorts.pkey.on "data", (@pkey) =>

    @inPorts.in.on "connect", =>
      @objects = {}

    @inPorts.in.on "begingroup", (group) =>
      @table = group
      @objects[@table] = []

    @inPorts.in.on "data", (object) =>
      @objects[@table].push object if @table?

    @inPorts.in.on "endgroup", (group) =>
      @table = null

    @inPorts.in.on "disconnect", =>
      @clean()

      @outPorts.template.send @constructTemplate()
      @outPorts.out.connect()
      for table, objects of @objects
        for object in objects
          id = object[@pkey]

          for key, value of object
            @outPorts.out.beginGroup @constructPlaceholder table, key, id, ""
            @outPorts.out.send value
            @outPorts.out.endGroup()
      @outPorts.out.disconnect()
      @outPorts.template.disconnect()

  clean: ->
    for table, objects of @objects
      for object in objects
        for key, value of object
          delete object[key] unless value?
      @objects[table] = _.reject objects, _.isEmpty

  constructPlaceholder: (table, key, id = "", prefix = "&") ->
    "#{prefix}#{table}_#{key}_#{id}"

  constructTemplate: ->
    templates = []
    returnTemplates = []

    for table, objects of @objects
      for object in objects
        id = object[@pkey]
        keys = _.keys object

        idTemplate = "#{@pkey} = #{@constructPlaceholder(table, @pkey, id)}"

        selects = _.map keys, (key) =>
          @constructPlaceholder table, key, id
        selectTemplate = selects.join ", "

        sets = _.map keys, (key, i) =>
          "#{key}=#{selects[i]}"
        setTemplate = sets.join ", "

        templates.push """
          UPDATE #{table} SET #{setTemplate}
            WHERE #{idTemplate};
          INSERT INTO #{table} (#{keys.join(", ")})
            SELECT #{selectTemplate}
            WHERE NOT EXISTS
            (SELECT 1 FROM #{table} WHERE #{idTemplate});
        """

```
Add returning SELECT clause for each table

```coffeescript
      placeholders = _.map objects, (object) =>
        @constructPlaceholder table, @pkey, object[@pkey]

      if placeholders.length > 0
        returnTemplates.push """
          (SELECT rows FROM
            (SELECT *, '#{table}' AS _type FROM #{table}
              WHERE id IN (#{placeholders.join(", ")}))
            AS rows)
        """

    _s.clean """
      BEGIN;
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

        #{templates.join("\n")}

        SELECT row_to_json(rows) AS out FROM (
          #{returnTemplates.join(" UNION ")}
        ) AS rows;
      END;
    """

exports.getComponent = -> new ConstructWrite

```