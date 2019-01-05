open Styling

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
    <link rel="stylesheet" href="/css/custom.css" />
    {Pushy.pushy_require}
  </head>
  <body>
    {Pushy.pushy_menu
         {Left = True, Main = List.mp (fn x => {Item = x, Submenu = []}) content.Navigation}
         (fn menubutton =>
             <xml>
               {menubutton}
	       {content.Page}
             </xml>)
    }
  </body>
</xml>
