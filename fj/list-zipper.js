//
// an implementation of zipper
// internally, it's a pair of singly-linked lists

// [a] -> zipper a | null
function zipper(xs) {
    if (xs.length == 0) {
        return null;
    } else {
        var r = null;
        for (var i = xs.length-1; i >= 0; i--) {r = cons(xs[i],r);}
        return pair(null,r);
    }
}
// zip2list :: zipper a -> [a]
function zip2array(z) {
    function arr(xs) {
        var r = [];
        for (var i = 0; xs; i++, xs = tail(xs)) {r[i] = head(xs);}
        return r;
    }
    return arr(fst(z)).reverse().concat(arr(snd(z)));
}

// beginZ :: zipper a -> Bool
function beginZ(z) { return fst(z) || false; }
// endZ :: zipper a -> Bool
function endZ(z) { return snd(z) || false; }
// emptyZ :: zipper a -> Bool
function emptyZ(z) { return beginZ(z) && endZ(z); }
// cursorZ :: zipper a -> a
// only call if endZ is false!
function cursorZ(z) { return head(snd(z)); }
// leftZ :: zipper a -> zipper a | null
// move cursor to the left; don't forget to check for invalidation!
function leftZ(z) {
    return fst(z)? pair(tail(fst(z)), cons(head(fst(z)),snd(z)))
                 : null;
}
// rightZ :: zipper a -> zipper a | null
// move cursor to the right; don't forget to revalidate!
function rightZ(z) {
    return snd(z)? pair(cons(head(snd(z)), fst(z)), tail(snd(z)))
                 : null;
}
