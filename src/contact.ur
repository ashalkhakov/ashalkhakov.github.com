open Tagffi

fun
main (nav : list {Title : string, Url : url})  : transaction page =
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

  <h1>Credits</h1>

  <p>Since I don't have a footer yet, let me give credit where it is due:</p>

  <ul>
    <li><a href="http://www.impredicative.com/ur">Ur/Web compiler</a> for powering this website</li>
    <li><a href="http://getskeleton.com/">Skeleton</a> for nice styling</li>
    <li><a href="https://picnicss.com/">Picnic CSS</a> for nice styling</li>
  </ul>
</xml>
})
