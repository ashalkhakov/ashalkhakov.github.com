fun main () : transaction page =
    return (Template.template_main {
	    Title= "Underivable - Test page",
	    Page= <xml>
	      <p>Hi</p>
          <h4>Notes:</h4>
	  <ul>
	    <li><a href={url (Urweb_setup.main ())}>Ur/Web dev box setup</a></li>
	  </ul>
	    </xml>
	   })
