fun
articles (): list {
             Title : string,
             Link : url,
             Author : {Nam : string, Email : url},
             Published : time,
             Summary : string
             } =
let
    val author = {Nam = "Somebody", Email = bless "author@example.com"}
in
    {Title= "Article 1",
      Link = url (article1 ()),
      Author = author,
      Published = fromDatetime 2019 1 1 12 35 36,
      Summary = "Article #1"} ::
     {Title= "Article 2",
      Link = url (article2 ()),
      Author = author,
      Published = fromDatetime 2018 12 25 9 34 47,
      Summary = "Article #2"} :: []
end

and main () : transaction page = return <xml>
  <body>
    <h1>Main</h1>
    <p>this is the main page</p>
  </body>
</xml>

and article1 () : transaction page = return <xml>
  <body>
    <h1>Article #1</h1>
    <p>This is the first article</p>
  </body>
</xml>

and article2 () : transaction page = return <xml>
  <body>
    <h1>Article #2</h1>
    <p>This is the second article</p>
  </body>
</xml>

and atom () : transaction page =
    t <- now;
    let
        val entries =
            List.foldl (fn x acc =>
                           let
                               val author = Feed.mkAuthor x.Author
                               val entry =
                                   Feed.mkEntry (x -- #Link -- #Author
                                                   ++ {Id = show x.Link,
                                                       Link = x.Link,
                                                       Typ = blessMime "text/html",
                                                       Author = author,
                                                       Updated = x.Published,
                                                       Content = x.Summary})
                           in
                               Feed.append acc entry
                           end)
                       Feed.empty
                       (articles ())
        val fd = Feed.mkFeed (url (atom ()))
                             {Link = url (main ()),
                              Title = "Blog title",
                              Subtitle = "subtitle of this weblog",
                              Id = "some-identifier",
                              Updated = t,
                              Entries = entries
                             }
    in
        Feed.atom fd
    end
