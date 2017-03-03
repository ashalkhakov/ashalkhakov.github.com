(*
- first, have to figure out how to write the calc using SAM...

initial state: input users and their amounts (add, remove, edit users), press the calculate button (after this, goes to calculated state)
- how do we map string to float and back for entry by user?
- basically done, but how do we show automatic summarization of all contribs?
 *)

(* ****** ****** *)
(* model and its associated actions *)

datatype appPage = Initial | Calculation

type contrib = {PersonName : source string, Amount : source (option float)}
type chip_in = {Total : float, EqualPayment : float}
type payback = {From : string, To : string, Amount : float, Complete : bool}
type contrib_list = {Contribs : Dlist.dlist contrib, Page : source appPage}

fun
init () =
rows <- Dlist.create;
pos <- source Initial;
return {Contribs = rows,
        Page = pos}

fun insert_contrib model =
    pname <- source "";
    amount <- source (Some 0.0);
    let
	val row = {PersonName = pname, Amount = amount}
    in
	Monad.ignore (Dlist.append model.Contribs row)
    end
fun delete_contrib model pos = Dlist.delete pos

fun is_valid (dl: contrib_list): signal (list string)(*validation error*) =
    r <- Dlist.size (dl.Contribs);
    rb <- Dlist.numPassing (fn x => opt <- signal (x.Amount); return (Option.isSome opt)) (dl.Contribs);
    let
	val msg = if r < 2 then "Please input at least two persons" :: Nil else Nil
	val msg = if rb < r then "Please ensure only numbers are input into textboxes" :: msg else msg
    in
	return msg
    end
	
fun
calc_chip_in (contribs: Dlist.dlist contrib): transaction chip_in =
elems <- (Dlist.elements1 contribs);
(total, count) <- List.foldlM
		      (fn c ((acc, cnt) : float * int) =>
			  amount <- get c.Amount;
			  return (acc + Option.unsafeGet amount, cnt+1))
		     (0.0, 0)
		     elems;
debug (show count);
return {Total = total,
	EqualPayment = if count > 0 then total / float(count) else 0.0}

fun
row_assign
    (* Assign new value to record field
    
    Usage:
    (row_assign [#Key] rec x)
    
    *)
    [nm :: Name] [t ::: Type] [ts ::: {Type}] [[nm] ~ ts]
    (r : $([nm = t] ++ ts)) (fx : t -> t) : $([nm = t] ++ ts) = (r --- [nm=t]) ++ {nm = (fx r.nm)}

fun
calc_paybacks (contribs: Dlist.dlist contrib): transaction (list payback) =
{Total = totalValue, EqualPayment = equalPayment} <- calc_chip_in contribs;
list <- current (Dlist.elements contribs);
tmpArr <- List.mapM
	      (fn ctr =>
		  text <- get (ctr.PersonName);
		  amount <- get (ctr.Amount);
		  return {Text = text,
			  Amount = equalPayment - Option.unsafeGet amount})
	      list;
debtors <- source (List.filter (fn e => e.Amount > 0.0) tmpArr);
lenders <- source (List.filter (fn e => e.Amount < 0.0) tmpArr);
values <- source Nil;
let
    fun
    step () =
    l <- get lenders;
    d <- get debtors;
    v <- get values;
    case (l, d) of
	(lender :: l, debtor :: d) => let
	    val delta = debtor.Amount + lender.Amount
	in
	    debug ("delta is  " ^ show delta);
	    (if delta < 0.0 then (
		 set values ({From= debtor.Text, To= lender.Text, Amount = debtor.Amount, Complete = False} :: v);
		 let
		     val lender =
			 row_assign
			     [#Amount]
			     lender
			     (fn x => x + debtor.Amount)
		 in
		     set lenders (lender :: l);
		     debug ("removing debtor " ^ debtor.Text);
		     set debtors d
		 end)
	     else (
		 set values ({From = debtor.Text, To = lender.Text, Amount = -lender.Amount, Complete = False} :: v);
		 let
		     val debtor =
			 row_assign
			     [#Amount]
			     debtor
			     (fn a => a + lender.Amount)
		 in
		     set lenders l;
		     debug ("removing lender " ^ lender.Text);
		     set debtors (debtor :: d)
		 end));
	    step ()
	end
      | (_, _) => return v
in
    step ()
end

fun calculate model = set model.Page Calculation
fun to_initial model = set model.Page Initial

(* ****** ****** *)
(* view *)

style card
style third
style tooltip_top
style menu
style burger
style pseudo
style buttonCss
style showCss
style stackCss
style errorCss
style labelCss
style twoCss
style brand
style flex
style five
style icon_cancel_circled2
style dangerous

style calc_main
style calc_float_left

fun view_init (model: contrib_list)
	      (summary : signal chip_in)
	      (messages : signal (list string))
	      (disable_next : signal bool): signal xbody =
    return <xml>
      {Dlist.render
	   (fn {PersonName = pname, Amount = amt} pos => <xml>
	     <div class="card">
		 <div class="third calc_float_left">
	       <label>Name: <ctextbox title="Name" class="stackCss" source={pname} required={True}/></label>
	       <label>Amount: <cnumber title="Amount" class="stackCss" source={amt} min={0.01} step={0.01} required={True} /></label>
		 </div>
	       <button class="dangerous" value="- Remove" onclick={fn _ => delete_contrib model pos}/>
	     </div>
	   </xml>)
	   {StartPosition = return None,
	    MaxLength = return None,
	    Filter = fn _ => return True,
	    Sort = return None}
	   model.Contribs}
      <br/>
      <button value="+ Add person" onclick={fn _ => insert_contrib model}></button>
      <br/>
      <dyn signal={
s <- summary;
lstr <- messages;
dis <- disable_next;
return <xml>
  <div class="flex twoCss">
    <div>
      <h4>Total amount <span class="labelCss">{[s.Total]}</span></h4>
      <h4>Equal pay <span class="labelCss">{[s.EqualPayment]}</span></h4>
    </div>
    <button data-tooltip="Press the button to view calculation results" class="tooltip-top" value="Next &#x25B6;" disabled={dis} onclick={fn _ => calculate model}></button>
  </div>
  {case lstr of
       [] => <xml></xml>
     | _ => <xml>
       <article class="card">
	 <header><h3>Validation errors</h3></header>
	 <section>
	   {List.mapX (fn x => <xml><span class="stackCss">{[x]}</span></xml>) lstr}
	 </section>
       </article>
     </xml>}
</xml>}/>
	     
    </xml>

fun view_calculation (grid: contrib_list): signal xbody =
    return <xml>
      <active code={
s <- calc_chip_in grid.Contribs;
lst <- calc_paybacks grid.Contribs;
return <xml>
  <div class="flex twoCss">
      <button value="Back &#x25C0;" onclick={fn _ => to_initial grid}></button>
      <div>
	<h4>Total amount <span class="labelCss">{[s.Total]}</span></h4>
	<h4>Equal pay <span class="labelCss">{[s.EqualPayment]}</span></h4>
      </div>
  </div>
  {List.mapX
       (fn x => <xml><div class="card"><h3>{[x.From]} &rarr; {[x.To]} <span class="labelCss">{[x.Amount]}</span></h3></div></xml>) lst}
</xml>
}/>	    
 </xml>

(* ****** ****** *)
(* control state *)

fun
state_chipin (model: contrib_list): signal chip_in =
(total, count) <- Dlist.foldl
		      (fn c ((acc, cnt) : float * int) =>
			  amount <- signal c.Amount;
			  return (acc + Option.get 0.0 amount, cnt+1))
		     (0.0, 0)
		     model.Contribs;
return {Total = total,
	EqualPayment = if count > 0 then total / float(count) else 0.0}

fun
state_messages (model: contrib_list): signal bool * signal (list string) =
let
    val msgs = is_valid model
    val dis_next =
	xs <- msgs;
	return (case xs of [] => False | _ => True)
in
    (dis_next, msgs)
end

fun state_representation grid =
    page <- signal grid.Page;
    case page of
	Initial =>
	let
	    val s = state_chipin grid
	    val (dis_next, msgs) = state_messages grid
	in
	    view_init grid s msgs dis_next
	end
      | Calculation => view_calculation grid

(* ****** ****** *)
(* main page *)
		       
fun appmain (): transaction page = 
    grid <- init ();
    id_self <- fresh;
    id_bmenug <- fresh;
    id_home <- fresh;
    return <xml>
      <head>
	<title>Split calculator</title>
	<link href="https://cdn.jsdelivr.net/picnicss/6.3.2/picnic.min.css" rel="stylesheet" type="text/css" />
	<link href="/css/split-calc.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
	<div>
	<nav>
	  <a id={id_self} class="brand">Split calculator</a>

	  <ccheckbox id={id_bmenug} class="showCss"></ccheckbox>
	  <label for={id_bmenug} class="burger pseudo buttonCss">&#8801;</label>
	  <div class="menu"></div>
	</nav>
	</div>
	<main id={id_home} class="calc_main">
	  <section>
	    <dyn signal={state_representation grid}/>
	  </section>
	</main>
      </body>
    </xml>
