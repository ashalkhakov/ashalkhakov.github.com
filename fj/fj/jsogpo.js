//
// some widgets
//

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

// check :: String -> (Dom, Behavior Bool)
function check(legend,caption) {
    var dom = INPUT({type:'checkbox'});
    return pair(FIELDSET(LEGEND(SPAN(legend)),
                  DIV(LABEL(dom,SPAN(caption)))),
                extractValueB(dom));
}

// the calculator itself
// ogpocalc :: Void -> Unit
function ogpocalc() {
    var p = pair; // save some typing
    // replicate
    function repl(x,d,ys) {
        return map(function(y) {
            return pair(y, x);
        }, ys).concat(pair('другой',d));
    }
    function parseFloatB(x) { return liftB(parseFloat,x); }
    function elem(lbl,xs) {
        // select1 does not preserve type!
        // it will yield strings...
        // we have to fix it here since we know we'll
        // be dealing with floats
        return label(lbl, second(parseFloatB, select1(xs))); 
    }
    // same as elem, except for:
    // if hypo is true, then
    // - disable select1
    // - propagate def instead of select1 value
    // optelem :: (Dom, Behavior Bool) * value
    //            * String * [(caption,value)]
    //            -> (Dom, Behavior value)
    function optelem(hypo, def, lbl, xs) {
        var hyp = snd(hypo);
        return second(function(x) {
            return ifB(hyp, constantB(def), x);
        }, label(lbl, second(parseFloatB,
                             select1(xs, {disabled:hyp}))));
    }
    var face = check('Тип лица', 'Юридическое лицо');
    var age = optelem(face, 0, 'Возраст водителя',
                  [p('менее двух лет', 0.05)
                  ,p('два и более года', 0.0)]);
    var benefits = optelem(face, 1.2, 'Льготы',
                      [p('отсутствуют', 1)
                      ,p('присутствуют',0.5)]);
    var exp = optelem(face, 0, 'Стаж',
                 [p('менее двух лет', 0.05)
                 ,p('два и более года',0)]);
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
    // the order of arguments should match the call to liftB
    // below
    function calc(c, transp, vage, age, bm, exp, benef) {
        var mrp = 1296; // a magical constant
        return Math.round(mrp * 1.9 * bm * c * transp * benef
                              * vage * (1.0 + exp + age));
    }
    // FIXME: it's very ugly that we throw our abstraction away
    // we need a monadic computation here, combining DOM chunks
    // in a transparent yet predictable fashion
    var calcB = liftB(calc, snd(cityreg), snd(transport),
                            snd(vage), snd(age), snd(bm),
                            snd(exp), snd(benefits));
    var dst = FORM({id:'ogpocalc', action:''},
                  FIELDSET(LEGEND('Входные данные'),
                    DIV(fst(cityreg)),
                    DIV(fst(transport)),
                    DIV(fst(vage)),
                    DIV({className:'radio'}, fst(face)),
                    DIV(fst(age)),
                    DIV(fst(benefits)),
                    DIV(fst(exp)),
                    DIV(fst(bm))),
                  FIELDSET(LEGEND('Результат'),
                    DIV(liftB(function(x){return x+'';},calcB))));
    insertDomB(dst, 'placeholder', 'over');
}

