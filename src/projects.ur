open Tagffi

fun main (spc: url) (nav : list {Title : string, Url : url}) : transaction page =
return (
Template.template_main {
Title= "Underivable - Projects",
Navigation= nav,
Page= <xml>
  <h1>Projects</h1>

  <h2>2017</h2>
  <ul>
    <li><a href="https://github.com/ashalkhakov/urweb-misc">urweb-misc</a></li>
    <li><a href={spc}>Split calculator</a> (Ur/Web-based)</li>
    <li><a href="https://ashalkhakov.github.io/pats-ef">PATS-EF</a>: an online "error filter", for making sense of type errors of ATS2</li>
    <li><a href="https://ashalkhakov.github.io/sam-tetris/">SAM-tetris</a>:
      a Tetris clone structured according to
      the <a href="https://sam.js.org"><strong>SAM (State, Action,
	Model)</strong></a> pattern. A bit unfinished (only keyboard
	input is supported).</li>
  </ul>

  <h2>2016</h2>
  <ul>    
    <li>
      <a href="html2pats.html">HTML2PATS</a>: a tool for generating HTML printers for ATS. Say you want to write some functions that print HTML (e.g. to generate a webpage). You could build up an HTML syntax tree for that (and then pretty-print it to textual HTML representation), but it would be suboptimal (in terms of runtime performance). Instead, you could preprocess a specially crafted HTML file to output ATS code that prints it out: much nicer syntax (familiar HTML), and you get function definitions for free, that you can plug into your program.</li>
      <li>
	<a href="https://github.com/ashalkhakov/ATS-playground">ATS playground</a>: some ATS code
      </li>
  </ul>

  <h2>2015</h2>
  <ul>
    <li><a href="https://github.com/DBCG/Dataphor/issues/3">dataphor</a>: compiling Dataphor to CIL via Reflection.Emit (in C#), to speed up the interpreter</li>
    <li><a href="https://bitbucket.org/shalkhakov/dataset2xf">dataset2xf</a>: generating CRUD interfaces (using XForms), given an ADO.NET Typed Dataset as input</li>
    <li>
      <p><a href="https://bitbucket.org/shalkhakov/ORMtools">ORMtools</a>: open-source <a href="http://orm.net">Object-Role Modeling tools</a></p>
      <ul>
	<li><code>orm2d4</code>: an XSLT2.0 stylesheet to transform <strong>NORMA</strong> ORM files to <strong>SVG</strong>. Runs in the browser via <a href="http://www.saxonica.com/ce/index.xml">Saxon-CE</a></li>
	<li><code>DCILtoD4</code>: for generating <a href="http://dataphor.org">Dataphor</a> schemata from ORM schemata produced by the <a href="https://sourceforge.net/projects/orm">NORMA</a> tool</li>
	<li><code>DDILtoSQLite</code>: the missing NORMA ORM to SQLite schema generator (seriously, missing SQLite support? are you kidding?)</li>
      </ul>
    </li>
    <!-- cfgtools -->
    <li><a href="https://github.com/ashalkhakov/sqliteclientsyn">SQLiteClientSync</a>: SQLite client sync provider for ADO.NET Sync Services for Devices (ported to WinMobile 6.5/.NET CF from its original desktop version, with author's permission). This is for implementing off-line applications with hub-and-spoke synchronization and conflict resolution.</li>
    <li><a href="https://github.com/ashalkhakov/nixpkgs/tree/gnustep">Support</a> for <a href="https://en.wikipedia.org/wiki/GNUstep">GNUstep</a> on <a href="https://nixos.org/">NixOS</a>: abandoned, but it was picked up by <a href="https://github.com/matthewbauer">@matthewbauer</a> and brought to fruition (thanks, Matthew!)</li>
  </ul>
    
  <h2>2012</h2>
  <ul>
    <li><a href="https://github.com/ashalkhakov/agda-tutorial-exercises">Exercises</a> from the <a href="http://www.cse.chalmers.se/~ulfn/papers/afp08/tutorial.pdf">Agda tutorial</a> by Ulf Norrel (contains spoilers!)</li>
    <li><a href="https://github.com/ashalkhakov/ats-opengles2-bind">ATS/Anairiats bindings to OpenGL ES2</a>: contains a robust Wavefront OBJ file parser and plenty of sample files</li>
  </ul>

  <h2>2011</h2>
  <ul>
    <li><a href="https://github.com/ashalkhakov/ats-miscellanea">ats-miscellanea</a>: some ATS1 code (regex matcher, ray caster, and minor code samples)</li>
  </ul>

  <h2>Earlier projects</h2>
  <ul>
    <!-- 2010: diploma project! -->
    <li>
      <p>2009: <a href="http://www.flapjax-lang.org">Flapjax</a>-based apps</p>
      <ul>
	<li><a href="/fj/tabs.html">Tabbed interface (with an RPN calculator)</a></li>
	<li><a href="/fj/jsogpo.html">OGPO (car insurance) calculator (in Russian, but you get the idea: mess with some knobs and have the insurance charges calculated for you)</a></li>
      </ul>
    </li>
    <!-- 2007: diploma project (graphics)
2006: 3d graphics stuff
2005: quake mods (PJQuake, etc.)
2004: quake2-studiomdl (need screenshots!)
-->
  </ul>
</xml>
})
