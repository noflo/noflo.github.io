---
  title: "Compress"
  library: "noflo-woute"
  layout: "component"

---

    EXPORT=OUTPUT.OUT:OUT
    EXPORT=BODY.IN:IN
    EXPORT=HEADERS.IN:HEADERS
    EXPORT=SESSIONID.IN:TOKEN
    EXPORT=RESPONSE.IN:RESPONSE
    EXPORT=STATUS.IN:STATUS
    
    '5' -> THRESHOLD Output(flow/CountedMerge)
    
    'status' -> GROUP Status(Group)
    Status() OUT -> IN Output()
    
    'headers' -> GROUP Headers(Group)
    Headers() OUT -> IN Output()
    
    'body' -> GROUP Body(Group)
    Body() OUT -> IN Output()
    
    'session-id' -> GROUP SessionId(Group)
    SessionId() OUT -> IN Output()
    
    'response' -> GROUP Response(Group)
    Response() OUT -> IN Output()
    
