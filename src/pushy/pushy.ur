type item = {Title : string, Link : url}
type menu = list {Item : item, Submenu : list item}

style site_overlay
style pushy
style pushy_submenu
style pushy_link
style pushy_left
style pushy_right
style pushy_content
style menu_btn

val pushy_require = <xml>
  <link rel="stylesheet" href="/css/pushy.css" />
</xml>

fun pushy_item (x : item) : xbody =
    <xml>
      <li class="pushy-link"><a href={x.Link}>{[x.Title]}</a></li>
    </xml>

fun pushy_menu (n : {Left : bool, Main : menu}) (fbody : xbody -> xbody) =
    <xml>
      <!-- Pushy Menu -->
      <nav class={classes pushy (if n.Left then pushy_left else pushy_right)}>
        <div class="pushy-content">
          <ul>
            {List.mapX (fn x =>
                           case x.Submenu of
                             | [] => pushy_item x.Item
                             | _ =>
                               <xml>
                                 <li class="pushy-submenu">
                                   <button>Submenu</button>
                                   <ul>
                                     {List.mapX pushy_item x.Submenu}
                                   </ul>
                                 </li>
                               </xml>)
                       n.Main}
            </ul>
        </div>
      </nav>

      <!-- Site Overlay -->
      <div class="site-overlay"></div>

      <!-- Your Content -->
      <div id={Pushy_ffi.pushy_container_id}>
        <!-- Menu Button -->
        {fbody <xml><button class="menu-btn">&#9776; Menu</button></xml>}
      </div>

      <!-- NOTE: pushy *requires* us to insert the script in the body ... -->
      <active code={Pushy_ffi.pushy_load (); return <xml/>}/>
  </xml>
