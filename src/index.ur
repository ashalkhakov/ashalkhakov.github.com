fun
topmenu (): list {Title : string, Link : url} =
{Title= "Main", Link= url (main ())}
    :: {Title= "Articles", Link= url (articles_main ())}
    :: {Title= "Projects", Link= url (projects_main ())}
    :: {Title= "Contact", Link= url (contact ())}
    :: []

(* ****** ****** *)

and
articles_main (): transaction page =
return (
Template.template_main {
Title= "Underivable - Articles",
Navigation= topmenu (),
Page= <xml>
  <h1>Articles</h1>
  <ul>
    <li><a href={url (articles_urweb_setup ())}>Ur/Web dev box setup</a></li>
    <li><a href={url (articles_splitcalc ())}>Split calculator</a></li>
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
