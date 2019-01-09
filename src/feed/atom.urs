val feed : bodyTag [Xmlns = string]
val title : bodyTag []
val subtitle : bodyTag []
val link : bodyTag [Href = url, Typ = mimeType, Rel = string, Title = string]
val id : bodyTag []
val author : bodyTag []
val name : bodyTag []
(* clashes with built-in email tag *)
(*val email : bodyTag []*)
(* clashes with built-in entry tag *)
val atomentry : bodyTag []
val published : bodyTag []
val updated : bodyTag []
val content : bodyTag [Typ = string]
