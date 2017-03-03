fun
topmenu (): list {Title : string, Url : url} =
{Title= "Main", Url= url (main ())}
    :: {Title= "Articles", Url= url (articles_main ())}
    :: {Title= "Split calculator", Url= url (split_calculator ())}
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
  </ul>
</xml>
})

and
articles_urweb_setup () =
Urweb_setup.main (topmenu ())

(* ****** ****** *)

and
split_calculator () =
Split_calculator.appmain ()

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
  <h4>Projects:</h4>
  <ul>
    <li><a href="html2pats.html">HTML2PATS</a>: a tool for generating HTML printers for ATS</li>
    <li><a href="https://ashalkhakov.github.io/sam-tetris/">SAM-tetris</a>:
      a Tetris clone structured according to
      the <a href="https://sam.js.org"><strong>SAM (State, Action,
	Model)</strong></a> pattern. A bit unfinished (only keyboard input is supported).</li>
  </ul>
</xml>
})
