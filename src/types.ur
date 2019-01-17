type pagenav = {Title : string, Link : url}
type author = {Nam : string, Email : url}
type article =
     {Title : string,
      Link : url,
      Author : author,
      Published : time,
      Updated : option time,
      Summary : string
     }
type blog = {Id : string,
             Title : string,
             Subtitle : string,
             Copyright : string,
             Author : author
            }
