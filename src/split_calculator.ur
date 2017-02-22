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

fun view_init (model: contrib_list)
	      (summary : signal chip_in)
	      (messages : signal (list string))
	      (disable_next : signal bool): signal xbody =
    return <xml>
      {Dlist.render
	   (fn {PersonName = pname, Amount = amt} pos => <xml>
	     <ctextbox source={pname} required={True}/>
	     <cnumber source={amt} min={0.01} step={0.01} required={True} /><br/>
	     <button value="Delete" onclick={fn _ => delete_contrib model pos}/>
	   </xml>)
	   {StartPosition = return None,
	    MaxLength = return None,
	    Filter = fn _ => return True,
	    Sort = return None}
	   model.Contribs}
      <br/>
      <button value="New row" onclick={fn _ => insert_contrib model}></button>
      <br/>
      <dyn signal={
s <- summary;
return <xml><p>Total amount: {[s.Total]}, Equal pay: {[s.EqualPayment]}</p></xml>
}/>
      <dyn signal={
lstr <- messages;
dis <- disable_next;
return <xml>
  <button value="Next" disabled={dis} onclick={fn _ => calculate model}></button>
  {case lstr of
       [] => <xml></xml>
     | _ => <xml>
       <p>Validation errors:</p>
       <ul>
	 {List.mapX (fn x => <xml><li>{[x]}</li></xml>) lstr}
       </ul>
     </xml>}
</xml>}/>
	     
    </xml>

fun view_calculation (grid: contrib_list): signal xbody =
    return <xml>
      <button value="Back" onclick={fn _ => to_initial grid}></button>
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
		       
fun main (): transaction page = 
    grid <- init ();
    return <xml>
      <head>
	<title>Split calculator</title>
      </head>
      <body>
	<dyn signal={state_representation grid}/>
      </body>
    </xml>
