type author
type entry
type collection
type feed

val mkAuthor : { Nam : string, Email : url } -> author
val mkEntry :
    { Id : string,
      Link : url,
      Typ : mimeType,
      Title : string,
      Published : time,
      Updated : time,
      Author : author,
      Summary : string,
      Content : string
    } -> entry

val empty : collection
val append : collection -> entry -> collection

val mkFeed : (*self*)url -> { Link : url, Title : string, Subtitle : string, Id : string, Updated : time, Entries : collection } -> feed

val atom : feed -> transaction page
