open Tagffi

fun
main (nav: list {Title : string, Url : url}): transaction page =
return (
Template.template_main {
Title= "Underivable - Split calculator app",
Navigation = nav,
Page= <xml>
  <h1>Introduction</h1>

  <p>Currently, there is a lot of churn in web frontend technology: libraries and frameworks are created almost weekly, to get obsoleted and forgotten just as quickly. Most of the churn is presented as innovation. It seems to me that programmers are just too eager to jump onto the next "newer, better" technology (well, at least I had to do it a few times at work: just pick <em>something</em>, and hope it will work for your project).</p>

  <p>Which is were we come to <a href="http://www.impredicative.com/ur">Ur/Web</a>. What is it?</p>

  <p>The Ur/Web programming language is a project by Adam Chlipala, and it gives some firm footing to web programming. With Ur/Web, the decades-old theoretical knowledge (as well as some pretty novel stuff) and practical experience in programming languages is directly applicable to the building of practical, everyday web applications!</p>

  <p>Why would somebody want to write an application using Ur/Web?</p>

  <ul>
    <li>the ideas of statically typed, higher order programming are gaining ground in the industry (see Swift, Rust, Flow, and even TypeScript could be put here, though it isn't "typed" in the same way as the other examples)</li>
    <li>pure, functional, reactive programming practices are gaining popularity among web frontend developers (witness the popularity of React and similar technologies, e.g. Vue.js, Inferno, Riot, etc.)</li>
  </ul>

  <p>Ur/Web shares all of these traits: it's typed, higher-order, pure, functional, and reactive. It's been around for quite some time. Now, enough with the talk, right? So let's build some applications instead! I certainly find this more rewarding.</p>

  <p>Let's think about the application we will be building. The idea, of course, is to build a (simple) app for myself to use. e.g. a <a href="http://chip-in.me/">chipin calculator</a>! Since the chief complaint about Ur/Web from practitioners has been that it's highly anti-modular (breaks MVC, lacks any separation of concerns, etc.), I'd like to explore how to <em>structure</em> Ur/Web applications so that they are modular (and hence, can be easily modified).</p>
  
  <h1>The application</h1>

  <p>The <a href="https://ashalkhakov.github.io/split-calculator.html">app</a> itself is very simple: it allows you to enter <em>people</em> and the <em>amounts</em> they have given to cover some <em>shared cost</em> to have it calculate for you who owes what to whom. The idea is simply that costs should be shared equally among participants.</p>

  <p>The application can be in different states: initial, and calculation results. In the initial state, let the user input persons and their amounts (add, remove, edit persons), then press the "calculate" button to have the app transition to the calculated state (where user will be able to see the results). The "calculate" button can be pressed only if all contribs are valid/positive/non-empty names; and there are at least two contribs.</p>
  
  <h1>The code</h1>

  <h2>Model and actions</h2>

  <p>As you can probably see on <a href="https://github.com/ashalkhakov/ashalkhakov.github.com/blob/source/src/split_calculator.ur">GitHub</a>, in the code we define some application-specific types first: <code>contrib</code>, <code>chip_in</code>, <code>payback</code> and <code>contrib_list</code>. In particular, <code>contrib_list</code> is the <strong>model</strong>, aka the state of the application. Then we define some actions that will mutate the model: the functions like <code>insert_contrib</code> and <code>delete_contrib</code> will simply perform the processing. As an aside, in <a href="http://sam.js.org/">SAM</a>, the responsbility to make changes to the model is contained within a single "present" method, while "actions" will only create well-formed  messages that are pure w.r.t. the model. My guess is that we can always emulate this approach in Ur/Web too, if necessary.</p>
  
  <p>Since Ur/Web is pure, how is mutation possible? Ur/Web defines an abstract type <code>source a</code> (for some type <code>a</code>), that works as a mutable <code>ref</code>-cell. Say, if you have <code>x</code> of type <code>source int</code>, then you can <code>set</code> its new value or <code>get</code> its current value. Of course, all of these operations only work in the <code>transaction</code> monad.</p>
    
  <h2>Rendering the model</h2>

  <p>Ur/Web provides the <code>signal</code> monad, for implementing FRP (functional-reactive programming) principles. To put it briefly, if you want to put something dynamic on the page, all the dynamism will usually come from <strong>reactions</strong> to changes of some <code>source</code>. For simplicity, form elements (like <code>input</code>s) can be hooked to <code>source</code>s, providing values for them, that is, as soon as user types something into an element, the source it is hooked to will have its value updated.</p>

  <p>How does the page react to changes to a source? In the <code>signal</code> monad, it is possible to "extract" the current value of the <code>source</code> (operationally: we subscribe to changes to the source), and use it in a further computation, which will usually end up code producing some markup.</p>

  <p>As you can see in the code, we have the function <code>state_representation</code> that computes the representation of the model's state (which is the HTML view!). For instance, we store the current "page" as a <code>source appPage</code>, then we subscribe to changes of page, which involves branching and calling different functions depeending on the current page. Simple!</p>
</xml>
})
