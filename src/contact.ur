open Tagffi

fun
main (nav : list {Title : string, Link : url})  : transaction page =
return (
Template.template_main {
Title= "Underivable - Contact",
Navigation = nav,
Page = <xml>
  <h1>Get in touch</h1>

  <dl>
    <dt>E-mail</dt>
    <dd><a href="mailto:artyomDOTshalkhakov@gmail.com">artyom DOT shalkhakov AT gmail DOT com</a></dd>
    <dt>GitHub</dt>
    <dd><a href="https://github.com/ashalkhakov">@ashalkhakov</a></dd>
  </dl>

  <h1>About</h1>

  <p>This is a personal website of Artyom Shalkhakov</p>
</xml>
})
