fun
topmenu (): list {Title : string, Link : url} =
{Title= "Main", Link= url (main ())}
    :: {Title= "Articles", Link= url (articles_main ())}
    :: {Title= "Projects", Link= url (projects_main ())}
    :: {Title= "Contact", Link= url (contact ())}
    :: []

and
articles (): list {
             Title : string,
             Link : url,
             Author : {Nam : string, Email : url},
             Published : time,
             Summary : string
             } =
let
    val author = {Nam = "Artyom Shalkhakov", Email = bless "artyom.shalkhakov@gmail.com"}
in
    {Title= "Ur/Web dev box setup", Link = url (articles_urweb_setup ()), Author = author, Published = fromDatetime 2016 8 1 0 0 0, Summary = "Setting up for U
r/Web development on Ubuntu"}
        :: {Title="Split calculator", Link = url (articles_splitcalc ()), Author = author, Published = fromDatetime 2017 4 2 0 0 0, Summary = "Some rambling ab
out the split calculator app"}
        :: []
end

(* ****** ****** *)

and
articles_feed (): transaction page =
t <- now;
Feed.atom (url (articles_feed ())) {
Link = url (main ()),
Title = "Underivable",
Subtitle = "a weblog",
Id = "https://ashalkhakov.github.io",
Updated = t,
Entries = List.mp (fn x => x -- #Link ++ {Id= show x.Link, Link = x.Link,
                                          Typ = blessMime "text/html",
                                          Updated = x.Published,
                                          Content = x.Summary }) (articles ())
}

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
