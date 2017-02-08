open Styling

fun
template_main (content : {Title: string, Page : xbody}): page = <xml>
  <head>
    <title>{[content.Title]}</title>
    <meta name="author" content="Artyom Shalkhakov" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="css/normalize.css" />
    <link rel="stylesheet" href="css/skeleton.css" />
  </head>           
  <body>
    <div class="s_container">
      <div class="s_row">
	<div class="s_one_half s_column">    
	  {content.Page}
	</div>
      </div>
    </div>
  </body>
</xml>
