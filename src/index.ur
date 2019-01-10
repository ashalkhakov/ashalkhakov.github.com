open Types

fun
topmenu (): list pagenav =
{Title= "Main", Link= url (main ())}
    :: {Title= "Articles", Link= url (articles_main ())}
    :: {Title= "Projects", Link= url (projects_main ())}
    :: {Title= "Contact", Link= url (contact ())}
    :: []

and
articles (): list article =
let

in
    {Title= "Ur/Web dev box setup",
      Link = url (articles_urweb_setup ()),
      Author = Config.blog.Author,
      Published = fromDatetime 2016 8 1 0 0 0,
      Summary = "Setting up for Ur/Web development on Ubuntu"} ::
     {Title="Split calculator",
      Link = url (articles_splitcalc ()),
      Author = Config.blog.Author,
      Published = fromDatetime 2017 4 2 0 0 0,
      Summary = "Some rambling about the split calculator app"} ::
    []
end

(* ****** ****** *)

and
articles_feed (): transaction page =
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
    val fd = Feed.mkFeed (url (articles_feed ()))
                         { Link = url (main ()),
                           Title = Config.blog.Title,
                           Subtitle = Config.blog.Subtitle,
                           Id = Config.blog.Id,
                           Updated = t,
                           Entries = entries
                         }
in
    Feed.atom fd
end

and
articles_main (): transaction page =
return (
Template.template_main {
Title= "Underivable - Articles",
Navigation= topmenu (),
Page= <xml>
  <h1>Articles</h1>
  <ul>
    {List.mapX (fn x => <xml><li><a href={x.Link}>{[x.Title]}</a></li></xml>) (articles ())}
  </ul>
</xml>
})

and
articles_urweb_setup () =
Urweb_setup.main (topmenu ())

and
articles_splitcalc () =
Splitcalc.main (topmenu ())

(* ****** ****** *)

and
projects_main (): transaction page =
Projects.main (url (split_calculator ())) (topmenu ())

(* ****** ****** *)

and
split_calculator () =
Split_calculator.appmain ()

(* ****** ****** *)

and
contact () =
Contact.main (topmenu ())

(* ****** ****** *)

and
main () : transaction page =
return (
Template.template_main {
Title= "Underivable - Home",
Navigation= topmenu (),
Page= <xml>
  <h1>Welcome to Underivable</h1>

  <p>This is a personal website of Artyom Shalkhakov. It exists to catalogue projects I worked on, and articles I have written (both of these are diminishingly small).</p>
</xml>
})
