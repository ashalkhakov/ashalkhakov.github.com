open Atom

type author = xbody
type entry = xbody
type collection = xbody
type feed = xbody

fun timefmt t =
    (* FIXME: this will output your *local* time as UTC!
     * the format should be %z at the end, not doing it
     * because Ur/Web doesn't currently handle timezones
     *)
    timef "%Y-%m-%dT%H:%M:%S" t ^ "Z"

fun mkAuthor x =
    <xml>
      <author>
        <name>{[x.Nam]}</name>
        (*<email>{[x.Email]}</email>*)
      </author>
    </xml>

fun mkEntry x =
    <xml>
      <atomentry>
        <id>{[x.Id]}</id>
        <link href={x.Link}/>
        <link type={x.Typ} rel="alternate" href={x.Link}/>
        <title>{[x.Title]}</title>
        <published>{[x.Published]}</published>
        <updated>{[timefmt x.Updated]}</updated>
        {x.Author}
        <summary>{[x.Summary]}</summary>
        <content>{[x.Content]}</content>
      </atomentry>
    </xml>

val empty = <xml/>
fun append c x = <xml>{c}{x}</xml>

fun mkFeed self fd =
  <xml>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>{[fd.Title]}</title>
      {if fd.Subtitle = "" then <xml/> else <xml><subtitle>{[fd.Subtitle]}</subtitle></xml>}
      <link href={fd.Link}/>
      <link type={blessMime "application/atom+xml"} rel="self" href={self}/>
      <updated>{[timefmt fd.Updated]}</updated>
      <id>{[fd.Id]}</id>
      {fd.Entries}
    </feed>
  </xml>


fun atom (fd : feed) : transaction page =
    returnBlob (textBlob (show fd)) (blessMime "application/atom+xml")
