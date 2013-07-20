---
  title: "Lift"
  library: "noflo-lift"
  layout: "component"

---

    EXPORT=PATTERN.IN:PATTERN
    EXPORT=INPUT.IN:IN
    EXPORT=ASSEMBLER.OUT:OUT
    EXPORT=EXTRACT.OUT:EXTRACTED
    EXPORT=TOKEN.OUT:EXTOKEN
    EXPORT=ASSEMBLER.REPLACEMENT:RETURN
    EXPORT=RETURNTOKEN.IN:RETOKEN
    

Save the patterns

    Pattern(Split) OUT -> PATTERN Assembler(lift/Assembler)
    Pattern() OUT -> PATTERN Extract(lift/Extractor)
    

Extraction

    Input(flow/CleanSplit) OUT -> IN RandomToken(swiss/RandomUuid) OUT -> IN Token(Split)
    Input() OUT -> IN Extract()
    

Caching

    Token() OUT -> KEY CacheInput(flow/Cache)
    Input() OUT -> IN CacheInput()
    

Assembly

    ReturnToken(Split) OUT -> KEY CacheInput()
    ReturnToken() OUT -> READY CacheInput() OUT -> IN Assembler()
    
