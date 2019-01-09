type author = { Nam : string, Email : url }
type entry = {
     Id : string,
     Link : url,
     Typ : mimeType,
     Title : string,
     Published : time,
     Updated : time,
     Author : author,
     Summary : string,
     Content : string
}
type feed = { Link : url, Title : string, Subtitle : string, Id : string, Updated : time, Entries : list entry }

val atom : url(*self*) -> feed -> transaction page
