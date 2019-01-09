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

open Atom

fun atom (self : url) (fd : feed) : transaction page =
    let
        val entries : xbody =
            List.mapX
                 (fn x =>
                     <xml>
                       <atomentry>
                         <id>{[x.Id]}</id>
                         <link href={x.Link}/>
                         <link type={x.Typ} rel="alternate" href={x.Link}/>
                         <title>{[x.Title]}</title>
                         <published>{[x.Published]}</published>
                         <updated>{[x.Updated]}</updated>
                         <author>
                           <name>{[x.Author.Nam]}</name>
                           (*<email>{[x.Author.Email]}</email>*)
                         </author>
                         <summary>{[x.Summary]}</summary>
                         <content>{[x.Content]}</content>
                       </atomentry>
                     </xml>)
                 fd.Entries
        val res : xbody = <xml>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>{[fd.Title]}</title>
            {if fd.Subtitle = "" then <xml/> else <xml><subtitle>{[fd.Subtitle]}</subtitle></xml>}
            <link href={fd.Link}/>
            <link type={blessMime "application/atom+xml"} rel="self" href={self}/>
            <updated>{[fd.Updated]}</updated>
            <id>{[fd.Id]}</id>
            {entries}
          </feed>
        </xml>
    in
    returnBlob
    (textBlob (show res))
    (blessMime "application/atom+xml")
    end
