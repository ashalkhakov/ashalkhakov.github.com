open Styling

fun
template_main (content :
	       { Title : string
	       , Navigation : list {Title : string, Url : url}
	       , Page : xbody
	      }): page = <xml>
  <head>
    <title>{[content.Title]}</title>
    <meta name="author" content="Artyom Shalkhakov" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="/css/normalize.css" />
    <link rel="stylesheet" href="/css/skeleton.css" />
    <link rel="stylesheet" href="/css/custom.css" />
  </head>           
  <body>
    <div class="s_container">
      <nav class="s_navbar">
	<div class="s_container">
	  <ul class="s_navbar_list">
	    {List.mapX (fn x =>
                        <xml>
                          <li class="s_navbar_item">
			    <a class="s_navbar_link" href={x.Url}>{[x.Title]}</a>
			  </li>
                        </xml>)
                       content.Navigation}
	  </ul>
	</div>
      </nav>
      <div class="s_row">
	<div class="s_column">    
	  {content.Page}
	</div>
      </div>
    </div>
  </body>
</xml>
