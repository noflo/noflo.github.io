---
  title: "ConvertToJson"
  library: "noflo-basecamp"
  layout: "component"

---

    noflo = require "noflo"
    
    getVal = (node) ->
      return node unless typeof node is 'object'
      return node unless node.length
      return node[0] unless node[0]['$']
      return null unless node[0]['_']
      return node[0]['_']
    
    class ConvertToJson extends noflo.Component
      constructor: ->
        @id = null
    
        @inPorts =
          in: new noflo.Port()
        @outPorts =
          out: new noflo.Port()
    
        @inPorts.in.on "begingroup", (group) =>
          @id = group
        @inPorts.in.on "data", (data) =>
          @outPorts.out.send @convert data
        @inPorts.in.on "endgroup", =>
          @id = null
        @inPorts.in.on "disconnect", =>
          do @outPorts.out.disconnect
    
      convert: (data) ->
        if data['completed-count'] and data['uncompleted-count']
          return @convertTaskList data
        return @convertTask data if data['completed'] and data['todo-list-id']
        return @convertHour data if data['hours'] and data['person-id']
    
        json =
          "@type": "prj:Project"
          "@subject": "#{@id}projects/#{getVal(data.id)}"
          "prj:name": getVal data.name
          "prj:status": getVal data.status
          "prj:startDate": getVal data['created-on']
          "dc:modified": getVal data['last-changed-on']
    
      convertTaskList: (data) ->
        json =
          "@type": "prj:TaskList"
          "@subject": "#{@id}todo_lists/#{getVal(data.id)}"
          "prj:name": getVal data.name
          "prj:inProject": "#{@id}projects/#{getVal(data['project-id'])}"
    
      convertTask: (data) ->
        json =
          "@type": "prj:Task"
          "@subject": "#{@id}todo_items/#{getVal(data.id)}"
          "prj:name": getVal data.content
          "prj:inTaskList": "#{@id}todo_lists/#{getVal(data['todo-list-id'])}"
          "dc:created": getVal data['created-at']
    
        if getVal data['completed-on']
          json['prj:finishDate'] = getVal data['completed-on']
    
        json
    
      convertHour: (data) ->
        json =
          "@type": "prj:Session"
          "@subject": "#{@id}time_entries/#{getVal(data.id)}"
          "prj:submittedDate": getVal data.date
          "prj:duration": parseFloat getVal data.hours
          "dc:description": getVal data.description
          "prj:reporter": "#{@id}people/#{getVal(data['person-id'])}"
          "prj:inProject": "#{@id}projects/#{getVal(data['project-id'])}"
            
        if getVal data['todo-item-id']
          json['prj:inTask'] = "#{@id}todo_items/#{getVal(data['todo-item-id'])}"
    
        json
    
    exports.getComponent = -> new ConvertToJson
    
