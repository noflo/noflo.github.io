---
  title: "Write"
  library: "noflo-pgorm"
  layout: "component"

---

    EXPORT=URL.IN:SERVER
    EXPORT=ERROR.OUT:ERROR
    EXPORT=FILTERTOKEN.IN:IN
    EXPORT=CONSTRUCT.PKEY:PKEY
    EXPORT=READY.OUT:READY
    EXPORT=PACKETIZE.OUT:OUT
    EXPORT=WRITESERVER.QUIT:QUIT
    EXPORT=PACKETIZE.FILTER:FILTER
    
    '.+' -> REGEXP FilterToken(groups/FilterByGroup)
    FilterToken() OUT -> IN Sanitize(pgorm/SanitizeObjects) OUT -> IN Construct(pgorm/ConstructWrite)
    Url(Split) OUT -> SERVER WriteServer(pg/Postgres) ERROR -> IN Error(Merge)
    
    FilterToken() GROUP -> TOKEN WriteServer()
    Construct() TEMPLATE -> TEMPLATE WriteServer()
    Construct() OUT -> IN WriteServer()
    

Convert to NoFlo packets


    WriteServer() OUT -> IN Packetize(pgorm/JsonToPackets)
    

Setup automatic filtering


    Url() OUT -> SERVER ConfigServer(pg/Postgres) ERROR -> IN Error()
    
    'columns' -> STRING ColumnsToken(SendString)
    '../config/read_columns.pgsql' -> IN Path(pgorm/ResolvePath) OUT -> IN ReadReadColumsFile(ReadFile) OUT -> STRING ReadColumns(SendString)
    ' ' -> STRING ColumnsActivator(SendString)
    
    Url() OUT -> IN ColumnsToken() OUT -> TOKEN ConfigServer()
    Url() OUT -> IN ReadColumns() OUT -> TEMPLATE ConfigServer()
    Url() OUT -> IN ColumnsActivator() OUT -> IN ConfigServer()
    
    'columns' -> REGEXP FilterColumns(groups/FilterByGroup)
    'table_name' -> GROUPING GroupColumnsByTable(objects/GroupValueByAnother)
    'column_name' -> ENCLOSED GroupColumnsByTable()
    ConfigServer() OUT -> IN FilterColumns() OUT -> IN GroupColumnsByTable() OUT -> IN Definitions(Split)
    
    Definitions() OUT -> DEFINITION Sanitize()
    Definitions() OUT -> IN Ready(Kick)
    
