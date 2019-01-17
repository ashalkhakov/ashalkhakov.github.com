open Styling
open Tagffi

fun
template_main (content :
	       { Title : string
	       , Navigation : list {Title : string, Link : url}
	       , Page : xbody
	      }): page = <xml>
  <head>
    <title>{[content.Title]}</title>
    <meta name="author" content="Artyom Shalkhakov" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/normalize.css" />
    <link rel="stylesheet" href="/css/tacit-css-1.3.6.min.css"/>
    <link rel="stylesheet" href="/css/custom.css" />
    {Pushy.pushy_require}
  </head>
  <body>
    {Pushy.pushy_menu
         {Left = True, Main = List.mp (fn x => {Item = x, Submenu = []}) content.Navigation}
         (fn menubutton =>
             <xml>
               <section>
                 <header>
                   <nav>
                     <ul><li><h1>{[content.Title]}</h1></li></ul>
                   </nav>
                   <nav>
                     <ul>
                       <li>{menubutton}</li>
                     </ul>
                   </nav>
                 </header>
                 <article>
	           {content.Page}
                 </article>
                 <footer>
                   <nav>
                     <ul>
                       <li>
                         <small>Copyright 2016-2019 Artyom Shalkhakov</small>
                       </li>
                     </ul>
                   </nav>
                   <nav>
                     <ul>
                       <li>
                         <small><a href="/atom.xml">Feed</a></small>
                       </li>
                       <li>
                         <small>
                           <a href="http://www.impredicative.com/ur">Ur/Web</a>
                         </small>
                       </li>
                       <li>
                         <small>
                           <a href="https://github.com/yegor256/tacit">Tacit</a>
                         </small>
                       </li>
                       <li>
                         <small>
                           <a href="https://chrisyee.ca/pushy/">Pushy</a>
                         </small>
                       </li>
                     </ul>
                   </nav>
                 </footer>
               </section>
             </xml>)
    }
  </body>
</xml>
