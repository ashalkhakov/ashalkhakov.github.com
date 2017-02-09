fun main () : transaction page =
return (
Template.template_main {
Title= "Underivable - Home",
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
  <h4>Notes:</h4>
  <ul>
    <li><a href={url (Urweb_setup.main ())}>Ur/Web dev box setup</a></li>
  </ul>
</xml>
})
