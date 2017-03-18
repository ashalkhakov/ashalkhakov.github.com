// simple pair and list
function pair(x,y) { return {fst:x,snd:y}; }
function fst(x) { return x.fst; }
function snd(x) { return x.snd; }
var head = fst;
var tail = snd;
var cons = pair;

// unzip :: [(a,b)] -> ([a],[b])
function unzip(xs) {
    return foldR(function(x,y) {
        var a = fst(y); a.unshift(fst(x));
        var b = snd(y); b.unshift(snd(x));
        return pair(a,b);
    }, pair([],[]), xs);
}

// zip :: ([a],[b]) -> [(a,b)]
function zip(xs,ys) {
    var r = [];
    var len = Math.min(xs.length,ys.length);
    for (var i = 0; i < len; i++) { r[i] = pair(xs[i],ys[i]); }
    return r;
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
