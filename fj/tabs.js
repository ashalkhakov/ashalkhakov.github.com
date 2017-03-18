// list with one selection
// [a] -> behavior a
// behavior [a] -> behavior a
// - why return behavior a?
//   - it's useful i suppose
// where do you get [a]?
// - from existing DOM
// - build it yourself dynamically
// two use-cases
// - enhancing the original page
//   - onload, find the existing elements
//   - destructively update: insertValueB, etc.
// - adding new content via javascript
//   - onload, create new elements
//   - insert them somewhere via destructive update
//     - insertDomB
// in both cases, we need something to work on:
// foo(input: [a], f:a -> event b): (Dom, Behavior a)
// how is selection performed?
// - instantly, via a pointing device (list selection)
//   - stateless, we don't maintain the cursor
// - through buttons which move cursor (carousel)
//   - stateful, we have a cursor
// - both ways (for you accessibility fags)
// how much elements can be selected at once?
// - one, or more than that?
// (Dom, EventStream a | Behavior a)

// collectEB :: EventStream a * b * (a * b -> b) -> Behavior b
function collectEB(ev,init,f) {
    return startsWith(collectE(ev,init,f), init);
}

//
// widget building blocks
//
function input(defvalue) {
    var x = INPUT({type:'text',name:'foo',value:defvalue||''});
    return pair(x, extractValueB(x));
}
function output(value) {
    return pair(DIV(value),
            constantB(0));
}
// what can we do now?
// write some combinators! (layout, validation, etc.)
// - layout (html) combinators would be great
//   - we need to augment the existing box model, though
// find categorical construct to describe this... (arrows?)
// binary functor (bifunctor) for pair

// bimap :: (a -> c) * (b -> d) * (a,b) -> (c,d)
function bimap(f,g,x) { return pair(f(fst(x)), g(snd(x))); }
// first :: (a -> c) * (a,b) -> (c,b)
function first(f,x) { return pair(f(fst(x)), snd(x)); }
// second :: (b -> d) * (a,b) -> (c,d)
function second(g,x) { return pair(fst(x), g(snd(x))); }

// appm
// convert an n-ary function to a function
// taking an array of arguments
function appm(f) { return function(xs) {return f.apply({}, xs);} }

//
// layout
//
function topdown(f) {
    var xs = unzip(slice(arguments,1));
    return pair(DIV(fst(xs)), f.apply({},snd(xs)));
}
function leftof(f) {
    function g(x) {
        return DIV({style:{display:'table-cell'}},x);
    }
    var xs = unzip(slice(arguments,1));
    return pair(DIV({style:{display:'table'}},
                map(g,fst(xs))),
            f.apply({},snd(xs)));
}

// an uber-simple RPN calculator
function load1() {
    // calc (operator,stack) -> stack
    function calc(op,s) {
        function ap(f) {
	    if (!s || !tail(s)) {
		alert('Not enough arguments on stack!');
		return s;
	    }
            var x = head(s);
            var y = head(tail(s));
            return cons(f(x,y),tail(tail(s)));
        }
        switch (op.type) {
        case 'c': return cons(0,null);
        case 'd': return cons(head(s)*10+op.d,tail(s));
        case '=': return cons(0,s);
        case '+': return ap(function(x,y){return x+y});
        case '-': return ap(function(x,y){return x-y});
        case '*': return ap(function(x,y){return x*y});
        case '/': return ap(function(x,y){return x/y});
        }
        throw "calc(): fell through switch!";
    }
    function skin(c,x) {
        var dom = BUTTON({type:'button'},x);
        return pair(dom, constantE(clicksE(dom),c));
    }
    function btns(cls, f, xs) {
        return bimap(function(x) {
            return FIELDSET({className:cls.join(' ')},x);
        }, appm(mergeE), unzip(map(f,xs)));
    }
    var digit = btns(['num', 'pad'], function(x) {
        return skin({type:'d',d:x}, x+'');
    }, [1,2,3,4,5,6,7,8,9,0]);
    var ops = btns(['operator', 'pad'], function(x) {
        return skin({type:x}, x);
    }, ['+','-','*','/','=']);
    var compB = collectEB(mergeE(snd(digit), snd(ops)),
                          cons(0,null), calc);
    var btnsB = liftB(function(x) {
            var tmp = '';
            for (var a = x; a; a = tail(a)) {
                tmp = ' ' + head(a) + tmp;
            }
            return tmp;
    }, compB);
    insertDomB(DIV({id:'calc'},
                P('Please use "=" to push a value to stack; invoking an operator like "+" will consume 2 stack elements'),
                FIELDSET({className:'results'},
			 INPUT({type:'text',value:btnsB,id:'rpnstackbox',mydata:'foo'})),
                fst(digit), fst(ops)),
               'tab-content-1', 'end');
    document.getElementById('rpnstackbox').setAttribute("readonly","true");
}

function zippermap(f,xs) {
    var l = xs.length;
    var r = [];
    for (var i = 0; i < l; i++) {
        var focus = xs[i];
        var rest = xs.slice(0,i).concat(xs.slice(i+1));
        r[i] = f(focus,rest);
    }
    return r;
}

// src :: [(Dom, EventStream b)] -> [(Dom, Behavior Bool)]
function maketabs(src) {
    return zippermap(function(x,rest) {
        var selE = mergeE(snd(x),
                          notE(appm(mergeE)(map(snd, rest))));
        // FIXME: a gross hack!
        // if we implemented zipper in javascript, we could:
        // - determine which element is initially selected
        // - use CT :)
        // - etc.
        var selB = selE.startsWith(x === src[0]? true : false);
        var clsB = liftB(function(x) {
            return x? "selected" : "deselected";
        }, selB);
        var dom = fst(x);
        insertValueB(clsB, dom, 'className');
        var contentId = fst(x).href.match(/#(.*)/)[1];
        insertValueB(clsB, contentId, 'className');
        return pair(dom, selB);
    }, src);
}

// tabs
// basically, tabs consist of:
// a set of buttons with only one being selected
// an area which displays something according to the selection
//
// they should be distinct!
// set of buttons = B
// set of areas = A
// - |A| = |B|, for all a of A there exist unique b of B
//   such that a is mapped to b
// - every element of A has to know about many things:
//   - how it switches state between "closed/open"
//   - how it relates to an element b of B
//   - a :: (Behavior bar -> Dom, EventStream foo)
// - every element of B has to know about "closing/opening"
//   - input: EventStream Bool
//   - output: Behavior (b of B)
function load2() {
    var domTabs = document.getElementById('tabs').getElementsByTagName('a');
    var tabs = maketabs(zip(domTabs, map(clicksE, domTabs)));
}

/*
 * regions contain cities
 * every city contains a coef, there is a fallback
 * - a tree, actually
 *
 * a list of vehicle types, each having a coef
 * - a tree, actually
 *
 * +a лицо (юр/физ) is a two-valued select1 with a coefs
 *
 * +bmcoefs is a select1 from a list of (name,coef)
 *
 * +benefits is a yes/no with corresponding coefs
 *
 * +(возраст водителя) age is a two-valued select1 with coefs
 *
 * +(срок экслуатации) vehicleAge is a two-valued select1
 *
 * +(стаж) stage is either a select1 of 2 values with coefs
 *
 * do we have any dependencies between fields?
 */

// label :: String * (Dom,a) -> (Dom,a)
function label(caption,y) {
    return first(function(x){return LABEL(SPAN(caption),x);}, y);
}

// select1 :: [(caption,value)] * Maybe Hash
//            -> (Dom, Behavior value)
function select1(xs,opts) {
    var dom = SELECT(opts || {}, map(function(x) {
        return OPTION({value:snd(x)},fst(x));
    },xs));
    return pair(dom, extractValueB(dom));
}

// gselect1 :: [(label,[(caption,value)])]
//             -> (Dom, Behavior value)
function gselect1(xs) {
    var dom = SELECT(map(function(x) {
        return OPTGROUP({label:fst(x)}, map(function(y) {
            return OPTION({value:snd(y)}, fst(y));
        },snd(x)));
    },xs));
    return pair(dom, extractValueB(dom));
}

/*
 * every region contains a list of cities,
 * every city contains a value that we need
 * forest: list of lists
 *
 * the value of the selection is just what has been chosen
 * everything else is unnecessary
 *
 */

// tree thingy
function load3() {
    var p = pair; // save some typing
    function check(lbl) {
        var dom = INPUT({type:'checkbox'});
        return pair(LABEL(dom,SPAN(lbl)), extractValueB(dom));
    }
    // replicate
    function repl(x,d,ys) {
        return map(function(y) {
            return pair(y, x);
        }, ys).concat(pair('другой',d));
    }
    function elem(lbl,xs) { return label(lbl, select1(xs)); }
    // same as elem, except for:
    // if hypo is true, then
    // - disable select1
    // - propagate def instead of select1 value
    // optelem :: (Dom, Behavior Bool) * value
    //            * String * [(caption,value)]
    //            -> (Dom, Behavior value)
    function optelem(hypo, def, lbl, xs) {
        var hyp = snd(hypo);
        return second(function(y) {
            return ifB(hyp, constantB(def), y);
        }, label(lbl, select1(xs, {disabled:hyp})));
    }
    var mrp = 1296; // a magical constant
    var face = check('Юридическое лицо');
    var age = optelem(face, 0, 'Возраст водителя',
                  [p('менее двух лет', 0.05)
                  ,p('два и более года', 0.0)]);
    var benefits = optelem(face, 1.2, 'Льготы',
                      [p('отсутствуют', 1)
                      ,p('присутствуют',0.5)]);
    var exp = optelem(face, 0, 'Стаж',
                 [p('менее двух лет', 0.05)
                 ,p('два и более года',0.0)]);
    var vage = elem('Возраст ТС',
            [p('до семи лет включительно', 1.0)
            ,p('свыше семи лет', 1.1)]);
    var bm = elem('БМ', [p('класс М', 2.45)
                        ,p('класс 0', 2.3)
                        ,p('класс 1', 1.55)
                        ,p('класс 2', 1.4)
                        ,p('класс 3', 1.0)
                        ,p('класс 4', 0.95)
                        ,p('класс 5', 0.9)
                        ,p('класс 6', 0.85)
                        ,p('класс 7', 0.8)
                        ,p('класс 8', 0.75)
                        ,p('класс 9', 0.7)
                        ,p('класс 10', 0.65)
                        ,p('класс 11', 0.6)
                        ,p('класс 12', 0.55)
                        ,p('класс 13', 0.5)]);
    var cityreg = label("Область/город регистрации ТС",
            gselect1(
              [p("Алматинская",
                [p('Талдыкорган', 1.78)
                ,p('Капчагай', 1.78)
                ,p('Текели', 1.78)
                ,p('Алматы', 2.96)
                ,p('другой', 1.424)])
              ,p("Южно-Казахстанская",
                 repl(1.01,0.808,['Шымкент', 'Арысь',
                     'Кентау', 'Туркестан']))
              ,p('Восточно-Казахстанская',
                 repl(1.96,1.568,['Усть-Каменогорск',
                     'Аягоз', 'Зыряновск', 'Курчатов',
                     'Риддер', 'Семипалатинск']))
              ,p('Костанайская',
                 repl(1.95, 1.56, ['Костанай', 'Аркалык',
                     'Лисаковск', 'Рудный']))
              ,p('Карагандинская',
                 repl(1.39, 1.112, ['Караганда','Балхаш',
                     'Жезказган', 'Каражал','Приозёрск', 
                     'Сарань', 'Сатпаев', 'Темиртау']))
              ,p('Северо-Казахстанская',
                 [p('Петропавловск', 1.33)
                 ,p('другой', 1.064)])
              ,p('Акмолинская',
                 [p('Кокчетав', 1.32)
                 ,p('Степногорск', 1.32)
                 ,p('Астана', 2.2)
                 ,p('другой', 1.056)])
              ,p('Павлодарская',
                  repl(1.63,1.304, ['Павлодар', 'Аксу',
                      'Экибастуз']))
              ,p('Жамбылская',
                  [p('Тараз',1.0),p('другой', 0.8)])
              ,p('Актюбинская',
                  [p('Актюбинск',1.34),p('другой', 1.08)])
              ,p('Западно-Казахстанская',
                  [p('Уральск', 1.17),p('другой', 0.963)])
              ,p('Кызылординская',
                  [p('Кызылорда',1.09),p('другой',0.872)])

              ,p('Атырауская',
                  [p('Атырау', 2.69),p('другой', 2.152)])
              ,p('Мангистауская',
                  repl(1.15,0.92,['Актау', 'Жанаозен']))]));
    var transport = elem('Тип транспортного средства',
           [p('легковые',2.09)
           ,p('автобусы, до 16 пассаж. мест включит.', 3.26)
           ,p('автобусы, свыше 16 пассаж. мест',3.45)
           ,p('грузовые',3.98)
           ,p('троллейбусы, трамваи',2.33)
           ,p('мототранспорт',1.0)
           ,p('прицепы, полуприцепы',1.0)]);
    // the order is important!
    var fields = [cityreg, transport, vage, face, age, bm, exp, benefits];
    // the order of arguments should match the fields above
    function calc(c, transp, vage, age, bm, exp, benef) {
        // FIXME: fucking weak typing turns z into a string!!!!
        var x = mrp * 1.9;
        var y = bm * c * transp * benef * vage;
        var z = 1.0 + parseFloat(exp) + parseFloat(age);
        return Math.round(x * y * z);
    }
    // FIXME: very ugly
    insertDomB(FIELDSET(LEGEND('Настройки'),
                   DIV(fst(face)),
                   DIV(fst(age)),
                   DIV(fst(benefits)),
                   DIV(fst(exp)),
                   DIV(fst(vage)),
                   DIV(fst(bm)),
                   DIV(fst(cityreg)),
                   DIV(fst(transport))), 'tab-content-3', 'end');
    var calcB = liftB(calc,snd(cityreg), snd(transport),snd(vage), snd(age),snd(bm),snd(exp),snd(benefits));
    insertDomB(INPUT({value:calcB,disabled:true}), 'tab-content-3', 'end');
    /*
    var calc = bimap(function(xs) {
        return DIV({id:'calcbody'}, map(DIV, xs));
    },function(xs) {
        return appm(liftB)([calc].concat(xs));
    }, unzip(fields));
    insertDomB(fst(calc), 'tab-content-3', 'end'); */
    /*
    var dst = label('Расчет:', output(snd(calc)));
    insertDomB(DIV({id:'ogpo'}, fst(calc), fst(dst)),
        'tab-content-3', 'end');
        */
}
