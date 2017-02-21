(*
- first, have to figure out how to write the calc using SAM...

initial state: input users and their amounts (add, remove, edit users), press the calculate button (after this, goes to calculated state)
- how do we map string to float and back for entry by user?
- basically done, but how do we show automatic summarization of all contribs?

calculated state: show editable lists
 *)

datatype appPage = Initial | Calculation

type contrib = {PersonName : source string, Amount : source (option float)}
type chip_in = {Total : float, EqualPayment : float}
type payback = {From : string, To : string, Amount : float, Complete : bool}
type contrib_list = {Contribs : Dlist.dlist contrib, Page : source appPage}

fun make_contrib () =
    pname <- source "";
    amount <- source (Some 0.0);
    return {PersonName = pname, Amount = amount}
fun insert contribs =
    row <- make_contrib ();
    Monad.ignore (Dlist.append contribs row)
fun delete pos = Dlist.delete pos

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
    
fun display_contrib {PersonName = pname, Amount = amt} pos = <xml>
  <ctextbox source={pname} required={True}/>
  <cnumber source={amt} min={0.01} step={0.01} required={True} /><br/>
  <button value="Delete" onclick={fn _ => delete pos}/>
</xml>

    (*
TODO: improving forms with ARIA attribs
https://www.sitepoint.com/html5-form-validation/

TODO: More logic:
- all names are pairwise disjoint (give an error as this might confuse people!)
- when things are valid, a NEXT button appears (becomes active/clickable)
			 - this button will trigger calculation + showing the next screen

how to switch between two screens:
- need more model state (e.g. if we are on the first screen)
- see which screen we are on... proceed as requested when rendering it
*)

fun render_next (lstr : list string) (next : Basis.mouseEvent -> transaction unit) : signal xbody = (
    (* no disabled attrib for buttons? why? *)
    case lstr of
	Nil => return <xml><button value="Next" disabled={False} onclick={next}></button></xml>
      | _ => return <xml>
	<button value="Next" disabled={True}></button>
	<p>Validation errors:</p>
	<ul>
	  {List.mapX (fn x => <xml><li>{[x]}</li></xml>) lstr}
	</ul>
      </xml>)

fun render_grid (grid: contrib_list): signal xbody =
    page <- signal grid.Page;
    case page of
	Initial => return <xml>
	  {Dlist.render
	       display_contrib
	       {StartPosition = return None,
		MaxLength = return None,
		Filter = fn _ => return True,
		Sort = return None}
	       grid.Contribs}
	  <button value="New row" onclick={fn _ => insert grid.Contribs}></button>
	  <br/>
	  <dyn signal={msg <- is_valid grid;
		       render_next msg (fn _ => set grid.Page Calculation)}/>
	</xml>
      | Calculation =>
	return <xml>
	  <button value="Back" onclick={fn _ => set grid.Page Initial}></button>
	    <active code={
chip_in <- calc_chip_in grid.Contribs;
lst <- calc_paybacks grid.Contribs;
return <xml>
  <p>Total amount: {[chip_in.Total]}, Equal pay: {[chip_in.EqualPayment]}</p>
  <ul>
    {List.mapX
	 (fn x => <xml><li>From: {[x.From]}, To: {[x.To]}, Amount: {[x.Amount]}</li></xml>) lst}
  </ul>
</xml>
}/>	    
	</xml>

fun main (): transaction page = 
    grid <- (rows <- Dlist.create;
	     pos <- source Initial;
	     return {Contribs = rows,
                     Page = pos});
    (* now, introduce a dyn tag that switches on page...
simple enough right???
 *)
    return <xml>
      <head>
	<title>foo</title>
      </head>
      <body>
	<dyn signal={render_grid grid}/>
      </body>
    </xml>
