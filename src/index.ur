fun
topmenu (): list {Title : string, Url : url} =
{Title= "Main", Url= url (main ())}
    :: {Title= "Articles", Url= url (articles_main ())}
    :: {Title= "Projects", Url= url (projects_main ())}
    :: {Title= "Contact", Url= url (contact ())}
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
Projects.main (topmenu ())

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
  <p>This website will host certain curiousities, such as
    information on using the <a href="http://www.ats-lang.org">ATS</a>
    programming language
  </p>
</xml>
})
