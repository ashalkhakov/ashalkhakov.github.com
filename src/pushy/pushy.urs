type item = {Title : string, Link : url}
type menu = list {Item : item, Submenu : list item}

val pushy_require : xhead

val pushy_menu : {Left : bool, (* should the menu be on the left (true) or on the right (false) *)
                  Main : menu} (* the menu structure *)
                 -> (xbody -> xbody) (* the rest of the page (argument is the button to call out the menu) *)
                 -> xbody
