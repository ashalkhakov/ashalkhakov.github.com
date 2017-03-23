// Detect browser quirks that we should be aware of.

function needsDynPrefix() {
    var span = document.createElement("span");
    span.innerHTML = "<script>alert('test');</script>";
    var scripts = span.getElementsByTagName("script");
    return scripts.length == 0;
}

var dynPrefix = needsDynPrefix() ? "<span style=\"display:none\">A</span>" : "";

// Function versions of operators

function not(x) { return !x; }
function neg(x) { return -x; }

function eq(x, y) { return x == y; }
function plus(x, y) { return x + y; }
function minus(x, y) { return x - y; }
function times(x, y) { return x * y; }
function div(x, y) { return x / y; }
function divInt(x, y) { if (y == 0) er("Division by zero"); var n = x / y; return n < 0 ? Math.ceil(n) : Math.floor(n); }
function mod(x, y) { return x % y; }
function modInt(x, y) { if (y == 0) er("Division by zero"); var n = x % y; return n < 0 ? Math.ceil(n) : Math.floor(n); }
function lt(x, y) { return x < y; }
function le(x, y) { return x <= y; }

// Characters

function isLower(c) { return c >= 'a' && c <= 'z'; }
function isUpper(c) { return c >= 'A' && c <= 'Z'; }
function isAlpha(c) { return isLower(c) || isUpper(c); }
function isDigit(c) { return c >= '0' && c <= '9'; }
function isAlnum(c) { return isAlpha(c) || isDigit(c); }
function isBlank(c) { return c == ' ' || c == '\t'; }
function isSpace(c) { return isBlank(c) || c == '\r' || c == '\n'; }
function isXdigit(c) { return isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'); }
function ord(c) { return c.charCodeAt(0); }
function isPrint(c) { return ord(c) > 31 && ord(c) < 127; }
function toLower(c) { return c.toLowerCase(); }
function toUpper(c) { return c.toUpperCase(); }

// Lists

function cons(v, ls) {
    return { next : ls, data : v };
}
function rev(ls) {
    var acc = null;
    for (; ls; ls = ls.next)
       acc = cons(ls.data, acc);
    return acc;
}
function concat(ls1, ls2) {
    var acc = ls2;
    ls1 = rev(ls1);
    for (; ls1; ls1 = ls1.next)
        acc = cons(ls1.data, acc);
    return acc;
}
function member(x, ls) {
    for (; ls; ls = ls.next)
        if (ls.data == x)
            return true;
    return false;
}
function remove(x, ls) {
    var acc = null;

    for (; ls; ls = ls.next)
        if (ls.data == x)
            return concat(acc, ls.next);
        else
            acc = cons(ls.data, acc);

    return ls;
}
function union(ls1, ls2) {
    var acc = ls2;

    for (; ls1; ls1 = ls1.next)
        if (!member(ls1.data, ls2))
            acc = cons(ls1.data, acc);

    return acc;
}
function length(ls) {
    var acc = 0;

    for (; ls; ls = ls.next)
        ++acc;

    return acc;
}


// Floats

function float(n) {
    return n;
}

function trunc(n) {
    return ~~n;
}

function ceil(n) {
    return Math.ceil(n);
}

function round(n) {
    return Math.round(n);
}

function pow(n, m) {
    return Math.pow(n, m);
}

function sqrt(n){
    return Math.sqrt(n);
}

function sin(n){
    return Math.sin(n);
}

function cos(n){
    return Math.cos(n);
}

function log(n){
    return Math.log(n);
}

function exp(n){
    return Math.exp(n);
}

function asin(n){
    return Math.asin(n);
}
function acos(n){
    return Math.acos(n);
}

function atan(n){
    return Math.atan(n);
}

function atan2(n, m){
    return Math.atan2(n, m);
}

function floor(n){
    return Math.floor(n);
}

function abs(n){
    return Math.abs(n);
}

// Time, represented as counts of microseconds since the epoch

var time_format = "%c";

function showTime(tm) {
    return strftime(time_format, tm);
}

function showTimeHtml(tm) {
    return eh(showTime(tm));
}

function now() {
    return (new Date()).getTime() * 1000;
}

function diffInSeconds(tm1, tm2) {
    return Math.round((tm2 - tm1) / 1000000);
}

function diffInMilliseconds(tm1, tm2) {
    return Math.round((tm2 - tm1) / 1000);
}

function toSeconds(tm) {
    return Math.round(tm / 1000000);
}

function toMilliseconds(tm) {
    return Math.round(tm / 1000);
}

function fromMilliseconds(tm) {
    return tm * 1000;
}

function addSeconds(tm, n) {
    return tm + n * 1000000;
}

function stringToTime_error(string) {
    var t = Date.parse(string);
    if (isNaN(t))
        er("Invalid date string: " + string);
    else
        return t * 1000;
}

function stringToTime(string) {
    try {
        var t = Date.parse(string);
        if (isNaN(t))
            return null;
        else
            return t * 1000;
    } catch (e) {
        return null;
    }
}

/*
strftime() implementation from:
YUI 3.4.1 (build 4118)
Copyright 2011 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

var xPad=function (x, pad, r)
{
    if(typeof r === "undefined")
    {
	r=10;
    }
    pad = pad.toString();
    for( ; parseInt(x, 10)<r && r>1; r/=10) {
	x = pad + x;
    }
    return x.toString();
};

var YDateEn = {
    a: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    A: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    b: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    B: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    c: "%a %d %b %Y %T %Z",
    p: ["AM", "PM"],
    P: ["am", "pm"],
    r: "%I:%M:%S %p",
    x: "%d/%m/%y",
    X: "%T"
};

var Dt = {
    formats: {
	a: function (d, l) { return l.a[d.getDay()]; },
	A: function (d, l) { return l.A[d.getDay()]; },
	b: function (d, l) { return l.b[d.getMonth()]; },
	B: function (d, l) { return l.B[d.getMonth()]; },
	C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
	d: ["getDate", "0"],
	e: ["getDate", " "],
	g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
	G: function (d) {
	    var y = d.getFullYear();
	    var V = parseInt(Dt.formats.V(d), 10);
	    var W = parseInt(Dt.formats.W(d), 10);

	    if(W > V) {
		y++;
	    } else if(W===0 && V>=52) {
		y--;
	    }

	    return y;
	},
	H: ["getHours", "0"],
	I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
	j: function (d) {
	    var gmd_1 = new Date("" + d.getFullYear() + "/1/1 GMT");
	    var gmdate = new Date("" + d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " GMT");
	    var ms = gmdate - gmd_1;
	    var doy = parseInt(ms/60000/60/24, 10)+1;
	    return xPad(doy, 0, 100);
	},
	k: ["getHours", " "],
	l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, " "); },
	m: function (d) { return xPad(d.getMonth()+1, 0); },
	M: ["getMinutes", "0"],
	p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
	P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
	s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
	S: ["getSeconds", "0"],
	u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
	U: function (d) {
	    var doy = parseInt(Dt.formats.j(d), 10);
	    var rdow = 6-d.getDay();
	    var woy = parseInt((doy+rdow)/7, 10);
	    return xPad(woy, 0);
	},
	V: function (d) {
	    var woy = parseInt(Dt.formats.W(d), 10);
	    var dow1_1 = (new Date("" + d.getFullYear() + "/1/1")).getDay();
	    var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
	    if(idow === 53 && (new Date("" + d.getFullYear() + "/12/31")).getDay() < 4)
	    {
		idow = 1;
	    }
	    else if(idow === 0)
	    {
		idow = Dt.formats.V(new Date("" + (d.getFullYear()-1) + "/12/31"));
	    }

	    return xPad(idow, 0);
	},
	w: "getDay",
	W: function (d) {
	    var doy = parseInt(Dt.formats.j(d), 10);
	    var rdow = 7-Dt.formats.u(d);
	    var woy = parseInt((doy+rdow)/7, 10);
	    return xPad(woy, 0, 10);
	},
	y: function (d) { return xPad(d.getFullYear()%100, 0); },
	Y: "getFullYear",
	z: function (d) {
	    var o = d.getTimezoneOffset();
	    var H = xPad(parseInt(Math.abs(o/60), 10), 0);
	    var M = xPad(Math.abs(o%60), 0);
	    return (o>0?"-":"+") + H + M;
	},
	Z: function (d) {
	    var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
	    if(tz.length > 4) {
		tz = Dt.formats.z(d);
	    }
	    return tz;
	},
	"%": function (d) { return "%"; }
    },

    aggregates: {
	c: "locale",
	D: "%m/%d/%y",
	F: "%Y-%m-%d",
	h: "%b",
	n: "\n",
	r: "%I:%M:%S %p",
	R: "%H:%M",
	t: "\t",
	T: "%H:%M:%S",
	x: "locale",
	X: "locale"
    },

    format : function (oDate, format) {
	var replace_aggs = function (m0, m1) {
	    var f = Dt.aggregates[m1];
	    return (f === "locale" ? YDateEn[m1] : f);
	};

	var replace_formats = function (m0, m1) {
	    var f = Dt.formats[m1];
	    switch(typeof f) {
	    case "string":
		return oDate[f]();
	    case "function":
		return f.call(oDate, oDate, YDateEn);
	    case "array":
            case "object":
		if(typeof(f[0]) === "string")
		    return xPad(oDate[f[0]](), f[1]);
	    default:
		return m1;
	    }
	};

	while(format.match(/%[cDFhnrRtTxX]/)) {
	    format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
	}

	var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);

	replace_aggs = replace_formats = undefined;

	return str;
    }
};

// End of YUI code

function strftime(fmt, thisTime)
{
    var thisDate = new Date();
    thisDate.setTime(Math.floor(thisTime / 1000));
    return Dt.format(thisDate, fmt);
};

function fromDatetime(year, month, date, hour, minute, second) {
  return (new Date(year, month, date, hour, minute, second)).getTime() * 1000;
};

function datetimeYear(t) {
  return (new Date(t / 1000)).getYear() + 1900;
};

function datetimeMonth(t) {
  return (new Date(t / 1000)).getMonth();
};

function datetimeDay(t) {
  return (new Date(t / 1000)).getDate();
};

function datetimeHour(t) {
  return (new Date(t / 1000)).getHours();
};

function datetimeMinute(t) {
  return (new Date(t / 1000)).getMinutes();
};

function datetimeSecond(t) {
  return (new Date(t / 1000)).getSeconds();
};

function datetimeDayOfWeek(t) {
  return (new Date(t / 1000)).getDay();
};


// Error handling

function uw_debug(msg) {
    try {
        console.debug(msg);
    } catch (e) {
        alert("DEBUG: " + msg);
    }

    return 0;
}

function whine(msg) {
    alert(msg);
    throw msg;
}

function pf(loc) {
    throw ("Pattern match failure (" + loc + ")");
}

var lameDuck = false;

function runHandlers(kind, ls, arg) {
    if (!lameDuck) {
        if (ls == null)
            alert(kind + ": " + arg);
        for (; ls; ls = ls.next)
            try {
                exec({c:"a", f:{c:"a", f:ls.data, x:{c:"c", v:arg}}, x:{c:"c", v:null}});
            } catch (v) { }
    }
}

var errorHandlers = null;

function flift0(v) {
    return {c:"c", v:v};
}

function onError(f) {
    errorHandlers = cons(flift0(f), errorHandlers);
}

function er(s) {
    runHandlers("Error", errorHandlers, s);
    throw {uw_error: s};
}

var failHandlers = null;

function onFail(f) {
    failHandlers = cons(flift0(f), failHandlers);
}

function doExn(v) {
    if (v == null || v.uw_error == null) {
        var s = (v == null ? "null" : v.message ? v.message : v.toString());
        if (v != null && v.fileName && v.lineNumber)
            s += " (" + v.fileName + ":" + v.lineNumber + ")";
        runHandlers("Fail", failHandlers, s);
    }
}

var disconnectHandlers = null;

function flift(f) {
    return {c: "c", v:{env:cons(f,null), body:{c:"v", n:1}}};
}

function onDisconnect(f) {
    disconnectHandlers = cons(flift(f), disconnectHandlers);
}

function discon() {
    runHandlers("Disconnect", disconnectHandlers, null);
}

var connectHandlers = null;

function onConnectFail(f) {
    connectHandlers = cons(flift(f), connectHandlers);
}

function conn(msg) {
    var rx = /(.*)<body>((.|\n|\r)*)<\/body>(.*)/g;
    var arr = rx.exec(msg);
    msg = (arr && arr.length >= 3) ? arr[2] : msg;
    runHandlers("RPC failure", connectHandlers, msg);
}

var serverHandlers = null;

function onServerError(f) {
    serverHandlers = cons(flift0(f), serverHandlers);
}

function servErr(s) {
    window.setTimeout(function () { runHandlers("Server", serverHandlers, s); }, 0);
}

// Key and mouse events

var uw_event = null;

function uw_getEvent() {
    return window.event ? window.event : uw_event;
}

function firstGood(x, y) {
    if (x == undefined || x == 0)
        return y;
    else
        return x;
}

function uw_mouseEvent() {
    var ev = uw_getEvent();

    return {_ScreenX : firstGood(ev.screenX, 0),
            _ScreenY : firstGood(ev.screenY, 0),
            _ClientX : firstGood(ev.clientX, 0),
            _ClientY : firstGood(ev.clientY, 0),
            _CtrlKey : firstGood(ev.ctrlKey, false),
            _ShiftKey : firstGood(ev.shiftKey, false),
            _AltKey : firstGood(ev.altKey, false),
            _MetaKey : firstGood(ev.metaKey, false),
            _Button : ev.button == 2 ? "Right" : ev.button == 1 ? "Middle" : "Left"};
}

function uw_keyEvent() {
    var ev = uw_getEvent();

    return {_KeyCode : firstGood(ev.keyCode, ev.which),
            _CtrlKey : firstGood(ev.ctrlKey, false),
            _ShiftKey : firstGood(ev.shiftKey, false),
            _AltKey : firstGood(ev.altKey, false),
            _MetaKey : firstGood(ev.metaKey, false)};
}



// Document events

function uw_handler(name, f) {
    var old = document[name];
    if (old == undefined)
        document[name] = function(event) { uw_event = event; execF(execF(f, uw_mouseEvent())); };
    else
        document[name] = function(event) { uw_event = event; old(); execF(execF(f, uw_mouseEvent())); };
}

function uw_onClick(f) {
    uw_handler("onclick", f);
}

function uw_onContextmenu(f) {
    uw_handler("oncontextmenu", f);
}

function uw_onDblclick(f) {
    uw_handler("ondblclick", f);
}

function uw_onMousedown(f) {
    uw_handler("onmousedown", f);
}

function uw_onMouseenter(f) {
    uw_handler("onmouseenter", f);
}

function uw_onMouseleave(f) {
    uw_handler("onmouseleave", f);
}

function uw_onMousemove(f) {
    uw_handler("onmousemove", f);
}

function uw_onMouseout(f) {
    uw_handler("onmouseout", f);
}

function uw_onMouseover(f) {
    uw_handler("onmouseover", f);
}

function uw_onMouseup(f) {
    uw_handler("onmouseup", f);
}

function uw_keyHandler(name, f) {
    var old = document[name];
    if (old == undefined)
        document[name] = function(event) { uw_event = event; execF(execF(f, uw_keyEvent())); };
    else
        document[name] = function(event) { uw_event = event; old(); execF(execF(f, uw_keyEvent())); };
}

function uw_onKeydown(f) {
    uw_keyHandler("onkeydown", f);
}

function uw_onKeypress(f) {
    uw_keyHandler("onkeypress", f);
}

function uw_onKeyup(f) {
    uw_keyHandler("onkeyup", f);
}

// Cancelling of further event processing

function uw_preventDefault() {
    var e = window.event ? window.event : uw_event;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
}

function uw_stopPropagation() {
    var e = window.event ? window.event : uw_event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

// Embedding closures in XML strings

function cs(f) {
    return {closure: f};
}

function isWeird(v) {
    return v.closure != null || v.cat1 != null;
}

function cat(s1, s2) {
    if (isWeird(s1) || isWeird(s2))
        return {cat1: s1, cat2: s2};
    else
        return s1 + s2;
}

var closures = [];
var freeClosures = null;

function newClosure(f) {
    var n;
    if (freeClosures == null) {
        n = closures.length;
    } else {
        n = freeClosures.data;
        freeClosures = freeClosures.next;
    }
    closures[n] = f;
    return n;
}

function freeClosure(n) {
    closures[n] = null;
    freeClosures = cons(n, freeClosures);
}

function cr(n) {
    return closures[n];
}

function flattenAcc(a, cls, trs) {
    while (trs) {
        var tr = trs.data;
        trs = trs.next;

        if (tr.cat1 != null) {
            trs = cons(tr.cat1, cons(tr.cat2, trs));
        } else if (tr.closure != null) {
            var cl = newClosure(tr.closure);
            cls.v = cons(cl, cls.v);
            a.push("cr(", cl.toString(), ")");
        } else
            a.push(tr);
    }
}

function flatten(cls, tr) {
    var a = [];
    flattenAcc(a, cls, cons(tr, null));
    return a.join("");
}

function flattenLocal(s) {
    var cls = {v : null};
    var r = flatten(cls, s);
    for (cl = cls.v; cl != null; cl = cl.next)
        freeClosure(cl.data);
    return r;
}


// Dynamic tree management

function populate(node) {
    if (node.dead) return;

    var s = node.signal;
    var oldSources = node.sources;
    try {
        var sr = execF(s, null);
        var newSources = sr._sources;

        for (var sp = oldSources; sp; sp = sp.next)
            if (!member(sp.data, newSources))
                sp.data.dyns = remove(node, sp.data.dyns);

        for (var sp = newSources; sp; sp = sp.next)
            if (!member(sp.data, oldSources))
                sp.data.dyns = cons(node, sp.data.dyns);

        node.sources = newSources;
        node.recreate(sr._data);
    } catch (v) {
        doExn(v);
    }
}

function sc(v) {
    return {data : v, dyns : null};
}
function sv(s, v) {
    if (s.data != v) {
        s.data = v;

        for (var ls = s.dyns; ls; ls = ls.next)
            populate(ls.data);
    }
}
function sg(s) {
    return s.data;
}

function ss(s) {
    return {env:cons(s, null), body:{c:"r", l:
            cons({n:"sources", v:{c:"c", v:cons(s, null)}},
                 cons({n:"data", v:{c:"f", f:sg, a:cons({c:"v", n:1}, null)}}, null))}};
}
function sr(v) {
    return {env:null, body:{c:"c", v:{_sources : null, _data : v}}};
}
function sb(x,y) {
    return {env:cons(y,cons(x,null)),
            body:{c:"=",
                e1:{c:"a", f:{c:"v", n:2}, x:{c:"c", v:null}},
                e2:{c:"=",
                    e1:{c:"a",
                        f:{c:"a", f:{c:"v", n:2}, x:{c:".", r:{c:"v", n:0}, f:"data"}},
                        x:{c:"c", v:null}},
                    e2:{c:"r", l:cons(
                                      {n:"sources", v:{c:"f", f:union, a:cons({c:".", r:{c:"v", n:1}, f:"sources"},
                                                                              cons({c:".", r:{c:"v", n:0}, f:"sources"}, null))}},
                                      cons({n:"data", v:{c:".", r:{c:"v", n:0}, f:"data"}}, null))}}}};
}
function scur(s) {
    return execF(s, null)._data;
}

function lastParent() {
    var pos = document.body;

    while (pos.lastChild && pos.lastChild.nodeType == 1)
        pos = pos.lastChild;

    pos = pos.parentNode;

    return pos;
}

var thisScript = null;

function addNode(node) {
    if (thisScript) {
        if (thisScript.parentNode)
            thisScript.parentNode.replaceChild(node, thisScript);
    } else
        lastParent().appendChild(node);
}

function runScripts(node) {
    if (node.tagName == "SCRIPT") {
        var savedScript = thisScript;
        thisScript = node;

        try {
            eval(thisScript.text);
        } catch (v) {
            doExn(v);
        }
        if (thisScript.parentNode)
            thisScript.parentNode.removeChild(thisScript);

        thisScript = savedScript;
    } else if (node.getElementsByTagName) {
        var savedScript = thisScript;

        var scripts = node.getElementsByTagName("script"), scriptsCopy = [];
        var len = scripts.length;
        for (var i = 0; i < len; ++i)
            scriptsCopy[i] = scripts[i];
        for (var i = 0; i < len; ++i) {
            thisScript = scriptsCopy[i];

            try {
                eval(thisScript.text);
            } catch (v) {
                doExn(v);
            }
            if (thisScript.parentNode)
                thisScript.parentNode.removeChild(thisScript);
        }

        thisScript = savedScript;
    }
}


// Dynamic tree entry points

function killScript(scr) {
    scr.dead = true;
    for (var ls = scr.sources; ls; ls = ls.next)
        ls.data.dyns = remove(scr, ls.data.dyns);
    for (var ls = scr.closures; ls; ls = ls.next)
        freeClosure(ls.data);
}

// Sometimes we wind up with tables that contain <script>s outside the single <tbody>.
// To avoid dealing with that case, we normalize by moving <script>s into <tbody>.
function normalizeTable(table) {
    var orig = table;

    var script, next;

    while (table && table.tagName != "TABLE")
        table = table.parentNode;

    for (var tbody = table.firstChild; tbody; tbody = tbody.nextSibling) {
        if (tbody.tagName == "TBODY") {
            var firstChild = tbody.firstChild;

            for (script = table.firstChild; script && script != tbody; script = next) {
                next = script.nextSibling;

                if (script.tagName === "SCRIPT") {
                    if (firstChild)
                        tbody.insertBefore(script, firstChild);
                    else
                        tbody.appendChild(script);
                }
            }

            return;
        }
    }

    var tbody = document.createElement("tbody");
    for (script = table.firstChild; script; script = next) {
        next = script.nextSibling;

        tbody.appendChild(script);
    }
    table.appendChild(tbody);
}

var suspendScripts = false;

function dyn(pnode, s) {
    if (suspendScripts)
        return;

    var x = document.createElement("script");
    x.dead = false;
    x.signal = s;
    x.sources = null;
    x.closures = null;

    var firstChild = null;

    x.recreate = function(v) {
        for (var ls = x.closures; ls; ls = ls.next)
            freeClosure(ls.data);

        var next;
        for (var child = firstChild; child && child != x; child = next) {
            next = child.nextSibling;

            killScript(child);
            if (child.getElementsByTagName) {
                var arr = child.getElementsByTagName("script");
                for (var i = 0; i < arr.length; ++i)
                    killScript(arr[i]);
            }

            if (child.parentNode)
                child.parentNode.removeChild(child);
        }

        var cls = {v : null};
        var html = flatten(cls, v);
        if (pnode != "table" && pnode != "tr")
            html = dynPrefix + html;
        x.closures = cls.v;

        if (pnode == "table") {
            normalizeTable(x.parentNode);

            var dummy = document.createElement("body");
            suspendScripts = true;
            try {
                dummy.innerHTML = "<table>" + html + "</table>";
            } catch (e) {
                suspendScripts = false;
                throw e;
            }

            var table = x.parentNode;

            if (table) {
                firstChild = null;
                var tbody;

                var arr = dummy.getElementsByTagName("tbody");

                var tbody;
                if (arr.length > 0 && arr[0].parentNode == dummy.firstChild) {
                    tbody = arr[0];
                    var next;
                    for (var node = dummy.firstChild.firstChild; node; node = next) {
                        next = node.nextSibling;

                        if (node.tagName != "TBODY")
                            tbody.appendChild(node);
                    }
                } else
                    tbody = dummy.firstChild;

                var next;
                firstChild = document.createElement("script");
                table.insertBefore(firstChild, x);
                for (var node = tbody.firstChild; node; node = next) {
                    next = node.nextSibling;
                    table.insertBefore(node, x);
                    suspendScripts = false;
                    runScripts(node);
                    suspendScripts = true;
                }
            }

            suspendScripts = false;
        } else if (pnode == "tr") {
            var dummy = document.createElement("body");
            suspendScripts = true;
            try {
                dummy.innerHTML = "<table><tr>" + html + "</tr></table>";
            } catch (e) {
                suspendScripts = false;
                throw e;
            }

            var table = x.parentNode;

            if (table) {
                var arr = dummy.getElementsByTagName("tr");
                firstChild = null;
                var tr;
                if (arr.length > 0 && table != null)
                    tr = arr[0];
                else
                    tr = dummy.firstChild;

                var next;
                firstChild = document.createElement("script");
                table.insertBefore(firstChild, x);
                for (var node = tr.firstChild; node; node = next) {
                    next = node.nextSibling;
                    table.insertBefore(node, x);
                    suspendScripts = false;
                    runScripts(node);
                    suspendScripts = true;
                }
            };

            suspendScripts = false;
        } else {
            firstChild = document.createElement("span");

            suspendScripts = true;
            try {
                firstChild.innerHTML = html;
                if (x.parentNode)
                    x.parentNode.insertBefore(firstChild, x);
            } catch (e) {
                suspendScripts = false;
                throw e;
            }
            suspendScripts = false;
            runScripts(firstChild);
        }
    };

    addNode(x);
    populate(x);
}

function setInnerHTML(node, html) {
    var x;

    if (node.previousSibling && node.previousSibling.closures != undefined) {
        x = node.previousSibling;

        for (var ls = x.closures; ls; ls = ls.next)
            freeClosure(ls.data);

        if (node.getElementsByTagName) {
            var arr = node.getElementsByTagName("script");
            for (var i = 0; i < arr.length; ++i)
                killScript(arr[i]);
        }
    } else {
        x = document.createElement("script");
        x.dead = false;
        x.sources = null;

        if (node.parentNode)
            node.parentNode.insertBefore(x, node);
        else
            whine("setInnerHTML: node is not already in the DOM tree");
    }

    var cls = {v : null};
    var html = flatten(cls, html);
    x.closures = cls.v;
    suspendScripts = true;
    node.innerHTML = html;
    suspendScripts = false;
    runScripts(node);
}

var maySuspend = true;

function active(s) {
    if (suspendScripts)
        return;

    var ms = maySuspend;
    maySuspend = false;
    try {
        var html = execF(s);
    } catch (e) {
        maySuspend = ms;
        throw e;
    }
    maySuspend = ms;
    if (html != "") {
        var span = document.createElement("span");
        addNode(span);
        setInnerHTML(span, html);
    }
}

function input(x, s, recreate, type, name) {
    if (name) x.name = name;
    if (type) x.type = type;
    addNode(x);

    var sc = document.createElement("script");
    sc.dead = false;
    sc.signal = ss(s);
    sc.sources = null;
    sc.recreate = recreate(x);

    if (x.parentNode)
        x.parentNode.insertBefore(sc, x);

    populate(sc);

    return x;
}

function inpt(type, s, name) {
    if (suspendScripts)
        return;

    var x = input(document.createElement("input"), s,
                  function(x) { return function(v) { if (x.value != v) x.value = v; }; }, type, name);
    x.value = s.data;
    x.onkeyup = x.oninput = x.onchange = x.onpropertychange = function() { sv(s, x.value) };

    return x;
}
function inpt_float(type, s, name) {
    if (suspendScripts)
        return;

    var filterFloat = function(value) {
	if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
	    .test(value))
	    return Number(value);
	return null;
    }
    var x = input(document.createElement("input"), s, function(x) { return function(v) { if (x.value != v) x.value = v; }; }, type, name);
    x.value = s.data;
    x.onkeyup = x.oninput = x.onchange = x.onpropertychange = function() { sv(s, filterFloat(x.value)) };

    return x;
}


function inp(s, name) {
    return inpt("text", s, name);
}

function password(s, name) {
    return inpt("password", s, name);
}

function email(s, name) {
    return inpt("email", s, name);
}

function search(s, name) {
    return inpt("search", s, name);
}

function url(s, name) {
    return inpt("url", s, name);
}

function tel(s, name) {
    return inpt("tel", s, name);
}

function color(s, name) {
    return inpt("color", s, name);
}

function number(s, name) {
    return inpt_float("number", s, name);
}

function range(s, name) {
    return inpt_float("range", s, name);
}

function date(s, name) {
    return inpt("date", s, name);
}

function datetime(s, name) {
    return inpt("datetime", s, name);
}

function datetime_local(s, name) {
    return inpt("datetime-local", s, name);
}

function month(s, name) {
    return inpt("month", s, name);
}

function week(s, name) {
    return inpt("week", s, name);
}

function time(s, name) {
    return inpt("time", s, name);
}


function selectValue(x) {
    if (x.options.length == 0)
        return "";
    else
        return x.options[x.selectedIndex].value;
}

function setSelectValue(x, v) {
  for (var i = 0; i < x.options.length; ++i) {
      if(x.options[i].value == v) {
          x.selectedIndex = i;
          return;
      }
  }
}

function sel(s, content) {
    if (suspendScripts)
        return;

    var dummy = document.createElement("span");
    dummy.innerHTML = "<select>" + content + "</select>";
    var x = input(dummy.firstChild, s, function(x) { return function(v) { if (selectValue(x) != v) setSelectValue(x, v); }; });

    for (var i = 0; i < x.options.length; ++i) {
        if (x.options[i].value == "")
            x.options[i].value = x.options[i].text;
        else
            x.options[i].value = x.options[i].value.substring(1);
    }

    setSelectValue(x, s.data);
    if (selectValue(x) != s.data)
        sv(s, selectValue(x));
    x.onchange = function() { sv(s, selectValue(x)) };

    return x;
}

function chk(s) {
    if (suspendScripts)
        return;

    var x = input(document.createElement("input"), s,
                  function(x) { return function(v) { if (x.checked != v) x.checked = v; }; }, "checkbox");
    x.defaultChecked = x.checked = s.data;
    x.onclick = x.onkeyup = x.oninput = x.onchange = x.onpropertychange = function() { sv(s, x.checked) };

    return x;
}

function tbx(s) {
    if (suspendScripts)
        return;

    var x = input(document.createElement("textarea"), s,
                  function(x) { return function(v) { if (x.value != v) x.value = v; }; });
    x.innerHTML = s.data;
    x.onkeyup = x.oninput = x.onchange = x.onpropertychange = function() { sv(s, x.value) };

    return x;
}

function dynClass(pnode, html, s_class, s_style) {
    if (suspendScripts)
        return;

    var htmlCls = {v : null};
    html = flatten(htmlCls, html);
    htmlCls = htmlCls.v;

    var dummy = document.createElement(pnode);
    suspendScripts = true;
    dummy.innerHTML = html;
    suspendScripts = false;
    var html = dummy.firstChild;
    dummy.removeChild(html);
    if (pnode == "table" && html.tagName == "TBODY") {
        html = html.firstChild;
    }
    addNode(html);
    runScripts(html);

    if (s_class) {
        var x = document.createElement("script");
        x.dead = false;
        x.signal = s_class;
        x.sources = null;
        x.closures = htmlCls;

        x.recreate = function(v) {
            for (var ls = x.closures; ls != htmlCls; ls = ls.next)
                freeClosure(ls.data);

            var cls = {v : null};
            html.className = flatten(cls, v);
	    x.closures = concat(cls.v, htmlCls);
        }

        html.appendChild(x);
        populate(x);
    }

    if (s_style) {
        var htmlCls2 = s_class ? null : htmlCls;
        var y = document.createElement("script");
        y.dead = false;
        y.signal = s_style;
        y.sources = null;
        y.closures = htmlCls2;

        y.recreate = function(v) {
            for (var ls = y.closures; ls != htmlCls2; ls = ls.next)
                freeClosure(ls.data);

            var cls = {v : null};
            html.style.cssText = flatten(cls, v);
	    y.closures = concat(cls.v, htmlCls2);
        }

        html.appendChild(y);
        populate(y);
    }
}

function bodyDynClass(s_class, s_style) {
    if (suspendScripts)
        return;

    var htmlCls = null;

    if (s_class) {
        var x = document.createElement("script");
        x.dead = false;
        x.signal = s_class;
        x.sources = null;
        x.closures = htmlCls;

        x.recreate = function(v) {
            for (var ls = x.closures; ls != htmlCls; ls = ls.next)
                freeClosure(ls.data);

            var cls = {v : null};
            document.body.className = flatten(cls, v);
            console.log("className to + " + document.body.className);
	    x.closures = concat(cls.v, htmlCls);
        }

        document.body.appendChild(x);
        populate(x);
    }

    if (s_style) {
        var htmlCls2 = s_class ? null : htmlCls;
        var y = document.createElement("script");
        y.dead = false;
        y.signal = s_style;
        y.sources = null;
        y.closures = htmlCls2;

        y.recreate = function(v) {
            for (var ls = y.closures; ls != htmlCls2; ls = ls.next)
                freeClosure(ls.data);

            var cls = {v : null};
            document.body.style.cssText = flatten(cls, v);
            console.log("style to + " + document.body.style.cssText);
	    y.closures = concat(cls.v, htmlCls2);
        }

        document.body.appendChild(y);
        populate(y);
    }
}

function addOnChange(x, f) {
    var old = x.onchange;
    if (old == null)
        x.onchange = f;
    else
        x.onchange = function() { old(); f(); };
}

function addOnKeyUp(x, f) {
    var old = x.onkeyup;
    if (old == null)
        x.onkeyup = f;
    else
        x.onkeyup = function(x) { old(x); f(x); };
}


// Basic string operations

function eh(x) {
    if (x == null)
        return "NULL";
    else
        return x.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}

function ts(x) { return x.toString() }
function bs(b) { return (b ? "True" : "False") }
function s2b(s) { return s == "True" ? true : s == "False" ? false : null; }
function s2be(s) { return s == "True" ? true : s == "False" ? false : er("Illegal Boolean " ^ s); }

function id(x) { return x; }
function sub(s, i) { return s.charAt(i); }
function suf(s, i) { return s.substring(i); }
function slen(s) { return s.length; }
function sidx(s, ch) {
    var r = s.indexOf(ch);
    if (r == -1)
        return null;
    else
        return r;
}
function ssidx(h, n) {
    var r = h.indexOf(n);
    if (r == -1)
        return null;
    else
        return r;
}
function sspn(s, chs) {
    for (var i = 0; i < s.length; ++i)
        if (chs.indexOf(s.charAt(i)) != -1)
            return i;

    return s.length;
}
function schr(s, ch) {
    var r = s.indexOf(ch);
    if (r == -1)
        return null;
    else
        return s.substring(r);
}
function ssub(s, start, len) {
    return s.substring(start, start+len);
}
function strlenGe(s, len) {
    return s.length >= len;
}

function trimZeroes(s) {
    for (var i = 0; i < s.length; ++i)
        if (s.charAt(i) != '0') {
            if (i > 0)
                return s.substring(i);
            else
                return s;
        }

    if (s.length == 0)
        return s;
    else
        return "0";
}

function pi(s) {
    var st = trimZeroes(s);
    var r = parseInt(st);
    if (r.toString() == st)
        return r;
    else
        er("Can't parse int: " + s);
}

function pfl(s) {
    var r = parseFloat(s);
    if (r.toString() == s)
        return r;
    else
        er("Can't parse float: " + s);
}

function pio(s) {
    var st = trimZeroes(s);
    var r = parseInt(st);
    if (r.toString() == st)
        return r;
    else
        return null;
}

function pflo(s) {
    var r = parseFloat(s);
    if (r.toString() == s)
        return r;
    else
        return null;
}

function parseSource(s1, s2) {
    return eval("s" + s1 + "_" + s2);
}

function uf(s) {
    if (s.length == 0)
        return "_";
    s = s.replace(/\./g, ".2E");
    return (s.charAt(0) == '_' ? "_" : "") + encodeURIComponent(s).replace(/%/g, ".");
}

function uu(s) {
    if (s.length > 0 && s.charAt(0) == '_') {
        s = s.substring(1);
    } else if (s.length >= 3 && (s.charAt(0) == '%' || s.charAt(0) == '.')
               && s.charAt(1) == '5' && (s.charAt(2) == 'f' || s.charAt(2) == 'F'))
        s = s.substring(3);
    s = s.replace(/\+/g, " ");
    s = s.replace(/\./g, "%");
    return decodeURIComponent(s);
}

function atr(s) {
    return s.replace(/\"/g, "&quot;").replace(/&/g, "&amp;")
}

function ub(b) {
    return b ? "1" : "0";
}

function uul(getToken, getData) {
    var tok = getToken();
    if (tok == "Nil") {
        return null;
    } else if (tok == "Cons") {
        var d = getData();
        var l = uul(getToken, getData);
        return {_1:d, _2:l};
    } else
        whine("Can't unmarshal list (" + tok + ")");
}

function strcmp(str1, str2) {
    return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
}

function chr(n) {
    return String.fromCharCode(n);
}

function htmlifySpecialChar(ch) {
    return "&#" + ch.charCodeAt(0) + ";";
}


// Remote calls

var client_id = null;
var client_pass = 0;
var url_prefix = "/";
var timeout = 60;
var isPost = false;

function getXHR(uri)
{
    try {
        return new XMLHttpRequest();
    } catch (e) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                whine("Your browser doesn't seem to support AJAX.");
            }
        }
    }
}

var sig = null;

var unloading = false, inFlight = null;

function unload() {
    for (; inFlight; inFlight = inFlight.next) {
        inFlight.data.abort();
    }
}

function requestUri(xhr, uri, needsSig, isRpc) {
    var extraData = null;

    if (isRpc && uri.length > 2000) {
        extraData = uri.substring(2000);
        uri = uri.substring(0, 2000);
    }

    xhr.open("POST", uri, !unloading);
    xhr.setRequestHeader("Content-type", "text/plain");

    if (client_id != null) {
        xhr.setRequestHeader("UrWeb-Client", client_id.toString());
        xhr.setRequestHeader("UrWeb-Pass", client_pass.toString());
    }

    if (needsSig) {
        if (sig == null)
            whine("Missing cookie signature!");

        xhr.setRequestHeader("UrWeb-Sig", sig);
    }

    inFlight = cons(xhr, inFlight);
    xhr.send(extraData);
}

function xhrFinished(xhr) {
    xhr.abort();
    inFlight = remove(xhr, inFlight);
}

function unurlify(parse, s) {
    return parse(s);
}

function redirect(s) {
    window.location = s;
}

function makeSome(isN, v) {
    if (isN)
        return {v: v};
    else
        return v;
}

function rc(prefix, uri, parse, k, needsSig, isN) {
    if (!maySuspend)
        er("May not 'rpc' in main thread of 'code' for <active>");

    uri = cat(prefix, uri);
    uri = flattenLocal(uri);
    var xhr = getXHR();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var isok = false;

            try {
                if (xhr.status == 200)
                    isok = true;
            } catch (e) { }

            if (isok) {
                var lines = xhr.responseText.split("\n");
                if (lines.length != 2) {
                    if (isN == null)
                        whine("Bad RPC response lines");
                    else
                        k(null);
                } else {
                    eval(lines[0]);

                    try {
                        var v = parse(lines[1]);
                        try {
                            k(makeSome(isN, v));
                        } catch (v) {
                            doExn(v);
                        }
                    } catch (v) {
                        k(null);
                    }
                }
            } else {
                if (isN == null)
                    conn(xhr.responseText);
                else
                    k(null);
            }

            xhrFinished(xhr);
        }
    };

    requestUri(xhr, uri, needsSig, true);
}

function path_join(s1, s2) {
    if (s1.length > 0 && s1.charAt(s1.length-1) == '/')
        return s1 + s2;
    else
        return s1 + "/" + s2;
}

var channels = [];

function newQueue() {
    return { front : null, back : null };
}
function enqueue(q, v) {
    if (q.front == null) {
        q.front = cons(v, null);
        q.back = q.front;
    } else {
        var node = cons(v, null);
        q.back.next = node;
        q.back = node;
    }
}
function dequeue(q) {
    if (q.front == null)
        return null;
    else {
        var r = q.front.data;
        q.front = q.front.next;
        if (q.front == null)
            q.back = null;
        return r;
    }
}

function newChannel() {
    return { msgs : newQueue(), listeners : newQueue() };
}

function listener() {
    var uri = path_join(url_prefix, ".msgs");
    var xhr = getXHR();
    var tid, orsc, onTimeout, lastTick;

    var connect = function () {
        xhr.onreadystatechange = orsc;
        lastTick = new Date().getTime();
        tid = window.setTimeout(onTimeout, timeout * 500);
        requestUri(xhr, uri, false, false);
    }

    orsc = function() {
        if (xhr.readyState == 4) {
            window.clearTimeout(tid);

            var isok = false;

            try {
                if (xhr.status == 200)
                    isok = true;
            } catch (e) { }

            if (isok) {
                var text = xhr.responseText;
                if (text == "")
                    return;
                var lines = text.split("\n");

                if (lines.length == 1 && lines[0] == "R") {
                    lameDuck = true;

                    if (isPost)
                        history.back();
                    else
                        location.reload();

                    return;
                }

                if (lines.length < 2) {
                    discon();
                    return;
                }

                var messageReader = function(i) {
                    if (i+1 >= lines.length) {
                        xhrFinished(xhr);
                        connect();
                    }
                    else {
                        var chn = lines[i];
                        var msg = lines[i+1];

                        if (chn == "E") {
                            eval(msg);
                            window.setTimeout(function() { messageReader(i+2); }, 0);
                        } else {
                            if (chn < 0)
                                whine("Out-of-bounds channel in message from remote server");

                            var ch;

                            if (chn >= channels.length || channels[chn] == null) {
                                ch = newChannel();
                                channels[chn] = ch;
                            } else
                                ch = channels[chn];

                            var listener = dequeue(ch.listeners);
                            if (listener == null) {
                                enqueue(ch.msgs, msg);
                            } else {
                                try {
                                    listener(msg);
                                } catch (v) {
                                    doExn(v);
                                }
                            }

                            messageReader(i+2);
                        }
                    }
                }

                messageReader(0);
            }
            else {
                try {
                    if (xhr.status != 0)
                        servErr("Error querying remote server for messages: " + xhr.status);
                } catch (e) { }
            }
        }
    };

    onTimeout = function() {
        var thisTick = new Date().getTime();
        xhrFinished(xhr);

        if (thisTick - lastTick > timeout * 1000) {
            if (confirm("The session for this page has expired.  Please choose \"OK\" to reload.")) {
                if (isPost)
                    history.back();
                else
                    location.reload();
            }
        } else {
            connect();
        }
    };

    connect();
}

function rv(chn, parse, k) {
    if (!maySuspend)
        er("May not 'recv' in main thread of 'code' for <active>");

    if (chn == null)
        er("Client-side code tried to recv() from a channel belonging to a different page view.");

    if (chn < 0)
        whine("Out-of-bounds channel receive");

    var ch;

    if (chn >= channels.length || channels[chn] == null) {
        ch = newChannel();
        channels[chn] = ch;
    } else
        ch = channels[chn];

    var msg = dequeue(ch.msgs);
    if (msg == null) {
        enqueue(ch.listeners, function(msg) { k(parse(msg)); });
    } else {
        try {
            k(parse(msg));
        } catch (v) {
            doExn(v);
        }
    }
}

function sl(ms, k) {
    if (!maySuspend)
        er("May not 'sleep' in main thread of 'code' for <active>");

    window.setTimeout(function() { k(null); }, ms);
}

function sp(e) {
    window.setTimeout(function() { execF(e); }, 0);
}


// The Ur interpreter

var urfuncs = [];

function lookup(env, n) {
    while (env != null) {
        if (n == 0)
            return env.data;
        else {
            --n;
            env = env.next;
        }
    }

    whine("Out-of-bounds Ur variable reference");
}

function execP(env, p, v) {
    switch (p.c) {
    case "v":
        return cons(v, env);
    case "c":
        if (v == p.v)
            return env;
        else
            return false;
    case "s":
        if (v == null)
            return false;
        else
            return execP(env, p.p, p.n ? v.v : v);
    case "1":
        if (v.n != p.n)
            return false;
        else
            return execP(env, p.p, v.v);
    case "r":
        for (var fs = p.l; fs != null; fs = fs.next) {
            env = execP(env, fs.data.p, v["_" + fs.data.n]);
            if (env == false)
                return false;
        }
        return env;
    default:
        whine("Unknown Ur pattern kind " + p.c);
    }
}

function exec0(env, e) {
    return exec1(env, null, e);
}

function exec1(env, stack, e) {
    var stack, usedK = false;

    var saveEnv = function() {
        if (stack.next != null && stack.next.data.c != "<")
            stack = cons({c: "<", env: env}, stack.next);
        else
            stack = stack.next;
    };

    while (true) {
        switch (e.c) {
        case "c":
            var v = e.v;
            if (stack == null)
                return v;
            var fr = stack.data;

            switch (fr.c) {
            case "s":
                e = {c: "c", v: {v: v}};
                stack = stack.next;
                break;
            case "1":
                e = {c: "c", v: {n: fr.n, v: v}};
                stack = stack.next;
                break;
            case "f":
                fr.args[fr.pos++] = v;
                if (fr.a == null) {
                    var res;
                    stack = stack.next;

                    if (fr.f.apply)
                        res = fr.f.apply(null, fr.args);
                    else if (fr.args.length == 0)
                        res = fr.f();
                    else if (fr.args.length == 1)
                        res = fr.f(fr.args[0]);
                    else if (fr.args.length == 2)
                        res = fr.f(fr.args[0], fr.args[1]);
                    else if (fr.args.length == 3)
                        res = fr.f(fr.args[0], fr.args[1], fr.args[2]);
                    else if (fr.args.length == 4)
                        res = fr.f(fr.args[0], fr.args[1], fr.args[2], fr.args[3]);
                    else if (fr.args.length == 5)
                        res = fr.f(fr.args[0], fr.args[1], fr.args[2], fr.args[3], fr.args[4]);
                    else
                        whine("Native function has " + fr.args.length + " args, but there is no special case for that count.");

                    e = {c: "c", v: res};
                    if (usedK) return null;
                } else {
                    e = fr.a.data;
                    fr.a = fr.a.next;
                }
                break;
            case "a1":
                e = fr.x;
                stack = cons({c: "a2", f: v}, stack.next);
                break;
            case "a2":
                if (fr.f == null)
                    whine("Ur: applying null function");
                else if (fr.f.body) {
                    saveEnv();
                    env = cons(v, fr.f.env);
                    e = fr.f.body;
                } else {
                    e = {c: "c", v: fr.f(v)};
                    stack = stack.next;
                }
                break;
            case "<":
                env = fr.env;
                stack = stack.next;
                break;
            case "r":
                fr.fs["_" + fr.n] = v;
                if (fr.l == null) {
                    e = {c: "c", v: fr.fs};
                    stack = stack.next;
                } else {
                    fr.n = fr.l.data.n;
                    e = fr.l.data.v;
                    fr.l = fr.l.next;
                }
                break;
            case ".":
                e = {c: "c", v: v["_" + fr.f]};
                stack = stack.next;
                break;
            case ";":
                e = fr.e2;
                stack = stack.next;
                break;
            case "=":
                saveEnv();
                env = cons(v, env);
                e = fr.e2;
                break;
            case "m":
                var ps;
                for (ps = fr.p; ps != null; ps = ps.next) {
                    var r = execP(env, ps.data.p, v);
                    if (r != false) {
                        saveEnv();
                        env = r;
                        e = ps.data.b;
                        break;
                    }
                }
                if (ps == null)
                    whine("Match failure in Ur interpretation");
                break;
            default:
                whine("Unknown Ur continuation kind " + fr.c);
            }

            break;
        case "v":
            e = {c: "c", v: lookup(env, e.n)};
            break;
        case "n":
            var idx = e.n;
            e = urfuncs[idx];
            if (e.c == "t")
                e = urfuncs[idx] = eval("(" + e.f + ")");
            break;
        case "s":
            stack = cons({c: "s"}, stack);
            e = e.v;
            break;
        case "1":
            stack = cons({c: "1", n: e.n}, stack);
            e = e.v;
            break;
        case "f":
            if (e.a == null)
                e = {c: "c", v: e.f()};
            else {
                var args = [];
                stack = cons({c: "f", f: e.f, args: args, pos: 0, a: e.a.next}, stack);
                if (!e.a.data.c) alert("[2] fr.f = " + e.f + "; 0 = " + e.a.data);
                e = e.a.data;
            }
            break;
        case "l":
            e = {c: "c", v: {env: env, body: e.b}};
            break;
        case "a":
            stack = cons({c: "a1", x: e.x}, stack);
            e = e.f;
            break;
        case "r":
            if (e.l == null)
                whine("Empty Ur record in interpretation");
            var fs = {};
            stack = cons({c: "r", n: e.l.data.n, fs: fs, l: e.l.next}, stack);
            e = e.l.data.v;
            break;
        case ".":
            stack = cons({c: ".", f: e.f}, stack);
            e = e.r;
            break;
        case ";":
            stack = cons({c: ";", e2: e.e2}, stack);
            e = e.e1;
            break;
        case "=":
            stack = cons({c: "=", e2: e.e2}, stack);
            e = e.e1;
            break;
        case "m":
            stack = cons({c: "m", p: e.p}, stack);
            e = e.e;
            break;
        case "e":
            e = {c: "c", v: cs({c: "wc", env: env, body: e.e})};
            break;
        case "wc":
            env = e.env;
            e = e.body;
            break;
        case "K":
            { var savedStack = stack.next, savedEnv = env;
                e = {c: "c", v: function(v) { return exec1(savedEnv, savedStack, {c: "c", v: v}); } };}
            usedK = true;
            break;
        default:
            whine("Unknown Ur expression kind " + e.c);
        }
    }
}

function execD(e) {
    return exec0(null, e);
}

function exec(e) {
    var r = exec0(null, e);

    if (r != null && r.body != null)
        return function(v) { return exec0(cons(v, r.env), r.body); };
    else
        return r;
}

function execF(f, x) {
    return exec0(cons(x, f.env), f.body);
}


// Wrappers

function confrm(s) {
    return confirm(s) ? true : false;
}


// URL blessing

var urlRules = null;

function checkUrl(s) {
    for (var r = urlRules; r; r = r.next) {
        var ru = r.data;
        if (ru.prefix ? s.indexOf(ru.pattern) == 0 : s == ru.pattern)
            return ru.allow ? s : null;
    }

    return null;
}

function bless(s) {
    u = checkUrl(s);
    if (u == null)
        er("Disallowed URL: " + s);
    return u;
}


// Attribute name blessing

function blessData(s) {
    for (var i = 0; i < s.length; ++i) {
        var c = s[i];
        if (!isAlnum(c) && c != '-' && c != '_')
            er("Disallowed character in data-* attribute name");
    }

    return s;
}


// CSS validation

function atom(s) {
    for (var i = 0; i < s.length; ++i) {
        var c = s[i];
        if (!isAlnum(c) && c != '+' && c != '-' && c != '.' && c != '%' && c != '#')
            er("Disallowed character in CSS atom");
    }

    return s;
}

function css_url(s) {
    for (var i = 0; i < s.length; ++i) {
        var c = s[i];
        if (!isAlnum(c) && c != ':' && c != '/' && c != '.' && c != '_' && c != '+'
            && c != '-' && c != '%' && c != '?' && c != '&' && c != '=' && c != '#')
            er("Disallowed character in CSS URL");
    }

    return s;
}

function property(s) {
    if (s.length <= 0)
        er("Empty CSS property");

    if (!isLower(s[0]) && s[0] != '_')
        er("Bad initial character in CSS property");

    for (var i = 0; i < s.length; ++i) {
        var c = s[i];
        if (!isLower(c) && !isDigit(c) && c != '_' && c != '-')
            er("Disallowed character in CSS property");
    }

    return s;
}


// ID generation

var nextId = 0;

function fresh() {
    return "uw" + (--nextId);
}

function giveFocus(id) {
    var node = document.getElementById(id);

    if (node)
        node.focus();
    else
        er("Tried to give focus to ID not used in document: " + id);
}


// App-specific code
urlRules = cons({allow:true,prefix:true,pattern:""},cons({allow:true,prefix:false,pattern:"/css/split-calc.css"},null));

urfuncs[2148] = {c:"t",f:'{c:"l",b:{c:"c",v:true}}'};
urfuncs[2149] = {c:"t",f:'{c:"l",b:{c:"c",v:"Name"}}'};
urfuncs[2150] = {c:"t",f:'{c:"l",b:{c:"c",v:0.01}}'};
urfuncs[2151] = {c:"t",f:'{c:"l",b:{c:"c",v:true}}'};
urfuncs[2152] = {c:"t",f:'{c:"l",b:{c:"c",v:0.01}}'};
urfuncs[2153] = {c:"t",f:'{c:"l",b:{c:"c",v:"Amount"}}'};
urfuncs[2154] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"=",e1:{c:"f",f:uw_mouseEvent,a:null},e2:{c:"m",e:{c:"v",n:3},p:cons({p:{c:"c",v:null},b:{c:"m",e:{c:"f",f:sg,a:cons({c:"v",n:5},null)},p:cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}}},cons({n:"Tail",p:{/*hoho*/c:"v"}},null))}},b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:1},null)},e2:{c:"f",f:sv,a:cons({c:"v",n:9},cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:null}},cons({p:{/*hoho*/c:"v"},b:{c:"r",l:cons({n:"Head",v:{c:"v",n:1}},cons({n:"Tail",v:{c:"v",n:2}},null))}},null))},null))}}},cons({p:{/*hoho*/c:"v"},b:{c:"c",v:null}},null))}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:3},null)},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:1},cons({c:"v",n:0},null))},e2:{c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"f",f:sv,a:cons({c:"v",n:7},cons({c:"v",n:2},null))}},cons({p:{/*hoho*/c:"v"},b:{c:"c",v:null}},null))}}}},null))}}}}}}}'};
urfuncs[2137] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"s",n:false,p:{c:"c",v:0}},b:{c:"c",v:""}},cons({p:{/*hoho*/c:"v"},b:{c:"m",e:{c:"v",n:2},p:cons({p:{c:"c",v:null},b:{c:"c",v:""}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:cat,a:cons({c:"c",v:"\\n\\074script type=\\"text/javascript\\">dyn(\\"span\\", execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2156},x:{c:"v",n:7}},x:{c:"v",n:6}},x:{c:"v",n:5}},x:{c:"v",n:3}},x:{c:"v",n:1}},x:{c:"v",n:0}},x:{c:"c",v:null}}},cons({c:"c",v:"))\\074/script>\\n"},null))},null))}},null))}},null))}}}}}}'};
urfuncs[2155] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:"v",n:1},null)},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2137},x:{c:"v",n:5}},x:{c:"v",n:4}},x:{c:"v",n:2}},x:{c:"v",n:0}},x:{c:"m",e:{c:"v",n:3},p:cons({p:{c:"c",v:null},b:{c:"c",v:null}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"f",f:minus,a:cons({c:"v",n:0},cons({c:"c",v:1},null))}},null))}},null)}},null))}}}}}}'};
urfuncs[2156] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"f",f:sr,a:cons({c:"f",f:cat,a:cons({c:"c",v:"\\n"},cons({c:"f",f:cat,a:cons({c:"m",e:{c:"v",n:2},p:cons({p:{c:"r",l:cons({n:"PersonName",p:{/*hoho*/c:"v"}},cons({n:"Amount",p:{/*hoho*/c:"v"}},null))},b:{c:"f",f:cat,a:cons({c:"c",v:"\\n\\074div class=\\"card\\">\\n\\074div class=\\"third calc-float-left\\">\\n\\074label>Name: \\074script type=\\"text/javascript\\">var d=inp(exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"v",n:1}},cons({c:"f",f:cat,a:cons({c:"c",v:"));d.className=\\"stack\\";d.required=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2148},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");d.title=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2149},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");\\074/script>\\074/label>\\n\\074label>Amount: \\074script type=\\"text/javascript\\">var d=number(exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"v",n:0}},cons({c:"f",f:cat,a:cons({c:"c",v:"));d.className=\\"stack\\";d.min=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2150},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");d.required=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2151},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");d.step=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2152},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");d.title=exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"n",n:2153},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:");\\074/script>\\074/label>\\n\\074/div>\\n\\074button class=\\"dangerous\\" onclick=\'uw_event=event;exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2154},x:{c:"v",n:8}},x:{c:"v",n:7}},x:{c:"v",n:6}},x:{c:"v",n:3}},x:{c:"c",v:null}}},cons({c:"c",v:")\'>- Remove\\074/button>\\n\\074/div>\\n"},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))}},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\n\\074script type=\\"text/javascript\\">dyn(\\"span\\", execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2155},x:{c:"v",n:6}},x:{c:"v",n:5}},x:{c:"v",n:3}},x:{c:"v",n:1}},x:{c:"c",v:null}}},cons({c:"c",v:"))\\074/script>\\n"},null))},null))},null))},null))},null)}}}}}}}}'};
urfuncs[2157] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:1},f:"Contribs"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:""},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},cons({n:"Tail",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:sr,a:cons({c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2137},x:{c:".",r:{c:"v",n:4},f:"Contribs"}},x:{c:"v",n:0}},x:{c:"c",v:null}},x:{c:"v",n:1}},x:{c:"c",v:null}},null)}},null))}},null))}}}'};
urfuncs[2160] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"=",e1:{c:"f",f:uw_mouseEvent,a:null},e2:{c:"f",f:sv,a:cons({c:".",r:{c:"v",n:2},f:"Page"},cons({c:"c",v:2021},null))}}}}'};
urfuncs[2162] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"=",e1:{c:"f",f:uw_mouseEvent,a:null},e2:{c:"f",f:sv,a:cons({c:".",r:{c:"v",n:2},f:"Page"},cons({c:"c",v:2020},null))}}}}'};
urfuncs[2158] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"f",f:sr,a:cons({c:"f",f:cat,a:cons({c:"c",v:"\\n\\074script type=\\"text/javascript\\">dyn(\\"span\\", execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2157},x:{c:"v",n:1}},x:{c:"c",v:null}}},cons({c:"c",v:"))\\074/script>\\n"},null))},null))},null)}}}'};
urfuncs[2159] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"=",e1:{c:"f",f:uw_mouseEvent,a:null},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"c",v:""},null)},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"c",v:0},null)},e2:{c:"=",e1:{c:"f",f:sg,a:cons({c:".",r:{c:"v",n:4},f:"Contribs"},null)},e2:{c:"=",e1:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"=",e1:{c:"f",f:sc,a:cons({c:"c",v:null},null)},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"v",n:0},null)},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:".",r:{c:"v",n:7},f:"Contribs"},cons({c:"r",l:cons({n:"Head",v:{c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"v",n:3}},cons({n:"PersonName",v:{c:"v",n:4}},null))}},cons({n:"2",v:{c:"v",n:1}},null))}},cons({n:"Tail",v:{c:"v",n:0}},null))},null))},e2:{c:"l",b:{c:"m",e:{c:"f",f:sg,a:cons({c:".",r:{c:"v",n:9},f:"Contribs"},null)},p:cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}}},cons({n:"Tail",p:{/*hoho*/c:"v"}},null))}},b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:1},null)},e2:{c:"f",f:sv,a:cons({c:".",r:{c:"v",n:13},f:"Contribs"},cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:null}},cons({p:{/*hoho*/c:"v"},b:{c:"r",l:cons({n:"Head",v:{c:"v",n:1}},cons({n:"Tail",v:{c:"v",n:2}},null))}},null))},null))}}},cons({p:{/*hoho*/c:"v"},b:{c:"c",v:null}},null))}}}}}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Tail",p:{/*hoho*/c:"v"}},null)}},b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:0},null)},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"c",v:null},null)},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:1},cons({c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"v",n:4}},cons({n:"PersonName",v:{c:"v",n:5}},null))}},cons({n:"2",v:{c:"v",n:0}},null))},null))},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:3},cons({c:"v",n:1},null))},e2:{c:"l",b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:3},null)},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:5},cons({c:"v",n:0},null))},e2:{c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"f",f:sv,a:cons({c:"v",n:7},cons({c:"v",n:6},null))}},cons({p:{/*hoho*/c:"v"},b:{c:"c",v:null}},null))}}}}}}}}},null))},e2:{c:"c",v:null}}}}}}}}'};
urfuncs[2097] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"c",v:null}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"r",l:cons({n:"1",v:{c:"v",n:1}},cons({n:"2",v:{c:"a",f:{c:"a",f:{c:"n",n:2097},x:{c:"f",f:sg,a:cons({c:"v",n:0},null)}},x:{c:"c",v:null}}},null))}},null))}}}'};
urfuncs[2134] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"v",n:2}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"=",e1:{c:"m",e:{c:"v",n:4},p:cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"r",l:cons({n:"1",v:{c:"f",f:plus,a:cons({c:"v",n:1},cons({c:"m",e:{c:"f",f:sg,a:cons({c:".",r:{c:"v",n:3},f:"Amount"},null)},p:cons({p:{c:"c",v:null},b:{c:"f",f:er,a:cons({c:"c",v:"Option.unsafeGet: encountered None"},null)}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"v",n:0}},null))},null))}},cons({n:"2",v:{c:"f",f:plus,a:cons({c:"v",n:0},cons({c:"c",v:1},null))}},null))}},null)},e2:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2134},x:{c:"v",n:0}},x:{c:"v",n:1}},x:{c:"c",v:null}}}},null))}}}}'};
urfuncs[2030] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"=",e1:{c:"m",e:{c:"f",f:sg,a:cons({c:"v",n:1},null)},p:cons({p:{c:"c",v:null},b:{c:"c",v:null}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},null)}},b:{c:"a",f:{c:"a",f:{c:"n",n:2097},x:{c:"v",n:0}},x:{c:"c",v:null}}},null))},e2:{c:"m",e:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2134},x:{c:"r",l:cons({n:"1",v:{c:"c",v:0}},cons({n:"2",v:{c:"c",v:0}},null))}},x:{c:"v",n:0}},x:{c:"c",v:null}},p:cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"=",e1:{c:"f",f:uw_debug,a:cons({c:"f",f:ts,a:cons({c:"v",n:0},null)},null)},e2:{c:"r",l:cons({n:"EqualPayment",v:{c:"m",e:{c:"f",f:not,a:cons({c:"f",f:le,a:cons({c:"v",n:1},cons({c:"c",v:0},null))},null)},p:cons({p:{c:"c",v:true},b:{c:"f",f:div,a:cons({c:"v",n:2},cons({c:"f",f:float,a:cons({c:"v",n:1},null)},null))}},cons({p:{c:"c",v:false},b:{c:"c",v:0}},null))}},cons({n:"Total",v:{c:"v",n:2}},null))}}},null)}}}}'};
urfuncs[2124] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"v",n:1}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"a",f:{c:"a",f:{c:"n",n:2124},x:{c:"r",l:cons({n:"1",v:{c:"v",n:1}},cons({n:"2",v:{c:"v",n:3}},null))}},x:{c:"v",n:0}}},null))}}}'};
urfuncs[2144] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"a",f:{c:"a",f:{c:"n",n:2124},x:{c:"c",v:null}},x:{c:"v",n:2}}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"=",e1:{c:"f",f:sg,a:cons({c:".",r:{c:"v",n:1},f:"PersonName"},null)},e2:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2144},x:{c:"v",n:6}},x:{c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"f",f:minus,a:cons({c:"v",n:6},cons({c:"m",e:{c:"f",f:sg,a:cons({c:".",r:{c:"v",n:2},f:"Amount"},null)},p:cons({p:{c:"c",v:null},b:{c:"f",f:er,a:cons({c:"c",v:"Option.unsafeGet: encountered None"},null)}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"v",n:0}},null))},null))}},cons({n:"Text",v:{c:"v",n:0}},null))}},cons({n:"2",v:{c:"v",n:5}},null))}},x:{c:"v",n:1}},x:{c:"c",v:null}}}},null))}}}}}'};
urfuncs[2120] = {c:"t",f:'{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:null},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:"v",n:0},null)},cons({c:"l",b:{c:"=",e1:{c:"a",f:{c:"n",n:2120},x:{c:"v",n:0}},e2:{c:"f",f:sb,a:cons({c:"v",n:0},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"r",l:cons({n:"1",v:{c:"v",n:4}},cons({n:"2",v:{c:"v",n:0}},null))},null)}},null))}}},null))}},null))}}'};
urfuncs[2145] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"a",f:{c:"a",f:{c:"n",n:2124},x:{c:"c",v:null}},x:{c:"v",n:1}}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"a",f:{c:"a",f:{c:"n",n:2145},x:{c:"m",e:{c:"f",f:not,a:cons({c:"f",f:le,a:cons({c:".",r:{c:"v",n:1},f:"Amount"},cons({c:"c",v:0},null))},null)},p:cons({p:{c:"c",v:true},b:{c:"r",l:cons({n:"1",v:{c:"v",n:1}},cons({n:"2",v:{c:"v",n:3}},null))}},cons({p:{c:"c",v:false},b:{c:"v",n:3}},null))}},x:{c:"v",n:0}}},null))}}}'};
urfuncs[2146] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"a",f:{c:"a",f:{c:"n",n:2124},x:{c:"c",v:null}},x:{c:"v",n:1}}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"a",f:{c:"a",f:{c:"n",n:2146},x:{c:"m",e:{c:"f",f:lt,a:cons({c:".",r:{c:"v",n:1},f:"Amount"},cons({c:"c",v:0},null))},p:cons({p:{c:"c",v:true},b:{c:"r",l:cons({n:"1",v:{c:"v",n:1}},cons({n:"2",v:{c:"v",n:3}},null))}},cons({p:{c:"c",v:false},b:{c:"v",n:3}},null))}},x:{c:"v",n:0}}},null))}}}'};
urfuncs[2033] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:3},null)},e2:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:5},null)},e2:{c:"=",e1:{c:"f",f:sg,a:cons({c:"v",n:4},null)},e2:{c:"m",e:{c:"r",l:cons({n:"1",v:{c:"v",n:2}},cons({n:"2",v:{c:"v",n:1}},null))},p:cons({p:{c:"r",l:cons({n:"1",p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}}},cons({n:"2",p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}}},null))},b:{c:"=",e1:{c:"f",f:plus,a:cons({c:".",r:{c:"v",n:1},f:"Amount"},cons({c:".",r:{c:"v",n:3},f:"Amount"},null))},e2:{c:"=",e1:{c:"f",f:uw_debug,a:cons({c:"f",f:cat,a:cons({c:"c",v:"delta is  "},cons({c:"a",f:{c:"c",v:ts},x:{c:"v",n:0}},null))},null)},e2:{c:"=",e1:{c:"m",e:{c:"f",f:lt,a:cons({c:"v",n:1},cons({c:"c",v:0},null))},p:cons({p:{c:"c",v:true},b:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:11},cons({c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:".",r:{c:"v",n:3},f:"Amount"}},cons({n:"Complete",v:{c:"c",v:false}},cons({n:"From",v:{c:".",r:{c:"v",n:3},f:"Text"}},cons({n:"To",v:{c:".",r:{c:"v",n:5},f:"Text"}},null))))}},cons({n:"2",v:{c:"v",n:6}},null))},null))},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:13},cons({c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"f",f:plus,a:cons({c:".",r:{c:"v",n:6},f:"Amount"},cons({c:".",r:{c:"v",n:4},f:"Amount"},null))}},cons({n:"Text",v:{c:".",r:{c:"v",n:6},f:"Text"}},null))}},cons({n:"2",v:{c:"v",n:5}},null))},null))},e2:{c:"=",e1:{c:"f",f:uw_debug,a:cons({c:"f",f:cat,a:cons({c:"c",v:"removing debtor "},cons({c:".",r:{c:"v",n:5},f:"Text"},null))},null)},e2:{c:"f",f:sv,a:cons({c:"v",n:16},cons({c:"v",n:5},null))}}}}},cons({p:{c:"c",v:false},b:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:11},cons({c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"f",f:neg,a:cons({c:".",r:{c:"v",n:5},f:"Amount"},null)}},cons({n:"Complete",v:{c:"c",v:false}},cons({n:"From",v:{c:".",r:{c:"v",n:3},f:"Text"}},cons({n:"To",v:{c:".",r:{c:"v",n:5},f:"Text"}},null))))}},cons({n:"2",v:{c:"v",n:6}},null))},null))},e2:{c:"=",e1:{c:"f",f:sv,a:cons({c:"v",n:13},cons({c:"v",n:5},null))},e2:{c:"=",e1:{c:"f",f:uw_debug,a:cons({c:"f",f:cat,a:cons({c:"c",v:"removing lender "},cons({c:".",r:{c:"v",n:7},f:"Text"},null))},null)},e2:{c:"f",f:sv,a:cons({c:"v",n:16},cons({c:"r",l:cons({n:"1",v:{c:"r",l:cons({n:"Amount",v:{c:"f",f:plus,a:cons({c:".",r:{c:"v",n:6},f:"Amount"},cons({c:".",r:{c:"v",n:8},f:"Amount"},null))}},cons({n:"Text",v:{c:".",r:{c:"v",n:6},f:"Text"}},null))}},cons({n:"2",v:{c:"v",n:5}},null))},null))}}}}},null))},e2:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2033},x:{c:"v",n:14}},x:{c:"v",n:13}},x:{c:"v",n:12}},x:{c:"c",v:null}},x:{c:"c",v:null}}}}}},cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"v",n:2}},null))}}}}}}}}}'};
urfuncs[2147] = {c:"t",f:'{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:""}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:cat,a:cons({c:"c",v:"\\074div class=\\"card\\">\\074h3>"},cons({c:"f",f:cat,a:cons({c:"f",f:eh,a:cons({c:".",r:{c:"v",n:1},f:"From"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:" → "},cons({c:"f",f:cat,a:cons({c:"f",f:eh,a:cons({c:".",r:{c:"v",n:1},f:"To"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:" \\074span class=\\"label\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:ts,a:cons({c:".",r:{c:"v",n:1},f:"Amount"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>\\074/h3>\\074/div>"},cons({c:"a",f:{c:"n",n:2147},x:{c:"v",n:0}},null))},null))},null))},null))},null))},null))},null))}},null))}}'};
urfuncs[2163] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"=",e1:{c:"a",f:{c:"a",f:{c:"n",n:2030},x:{c:".",r:{c:"v",n:2},f:"Contribs"}},x:{c:"c",v:null}},e2:{c:"=",e1:{c:"m",e:{c:"a",f:{c:"a",f:{c:"n",n:2030},x:{c:".",r:{c:"v",n:3},f:"Contribs"}},x:{c:"c",v:null}},p:cons({p:{c:"r",l:cons({n:"Total",p:{/*hoho*/c:"v"}},cons({n:"EqualPayment",p:{/*hoho*/c:"v"}},null))},b:{c:"=",e1:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2144},x:{c:"v",n:0}},x:{c:"c",v:null}},x:{c:"f",f:scur,a:cons({c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:5},f:"Contribs"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:null},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},null)}},b:{c:"a",f:{c:"n",n:2120},x:{c:"v",n:0}}},null))}},null))},null)}},x:{c:"c",v:null}},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"a",f:{c:"a",f:{c:"n",n:2145},x:{c:"c",v:null}},x:{c:"v",n:0}},null)},e2:{c:"=",e1:{c:"f",f:sc,a:cons({c:"a",f:{c:"a",f:{c:"n",n:2146},x:{c:"c",v:null}},x:{c:"v",n:1}},null)},e2:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2033},x:{c:"v",n:1}},x:{c:"v",n:0}},x:{c:"f",f:sc,a:cons({c:"c",v:null},null)}},x:{c:"c",v:null}},x:{c:"c",v:null}}}}}},null)},e2:{c:"f",f:cat,a:cons({c:"c",v:"\\n\\074div class=\\"flex two\\">\\n\\074button onclick=\'uw_event=event;exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2162},x:{c:"v",n:4}},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:")\'>Back &#x25C0;\\074/button>\\n\\074div>\\n\\074h4>Total amount \\074span class=\\"label\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:ts,a:cons({c:".",r:{c:"v",n:1},f:"Total"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>\\074/h4>\\n\\074h4>Equal pay \\074span class=\\"label\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:ts,a:cons({c:".",r:{c:"v",n:1},f:"EqualPayment"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>\\074/h4>\\n\\074/div>\\n\\074/div>\\n"},cons({c:"f",f:cat,a:cons({c:"a",f:{c:"n",n:2147},x:{c:"v",n:0}},cons({c:"c",v:"\\n"},null))},null))},null))},null))},null))},null))},null))},null))}}}}}}'};
urfuncs[2103] = {c:"t",f:'{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:0},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:"v",n:0},null)},cons({c:"l",b:{c:"=",e1:{c:"a",f:{c:"n",n:2103},x:{c:"v",n:0}},e2:{c:"f",f:sb,a:cons({c:"v",n:0},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"f",f:plus,a:cons({c:"v",n:0},cons({c:"c",v:1},null))},null)}},null))}}},null))}},null))}}'};
urfuncs[2136] = {c:"t",f:'{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:0},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:sb,a:cons({c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:1},f:"Amount"},null)},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:false}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"c",v:true}},null))},null)}},null))},cons({c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:"v",n:1},null)},cons({c:"l",b:{c:"=",e1:{c:"a",f:{c:"n",n:2136},x:{c:"v",n:0}},e2:{c:"f",f:sb,a:cons({c:"v",n:0},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"m",e:{c:"v",n:3},p:cons({p:{c:"c",v:true},b:{c:"f",f:plus,a:cons({c:"v",n:0},cons({c:"c",v:1},null))}},cons({p:{c:"c",v:false},b:{c:"v",n:0}},null))},null)}},null))}}},null))}},null))}},null))}}'};
urfuncs[2142] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"v",n:1},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:"v",n:0},null)},cons({c:"l",b:{c:"f",f:sb,a:cons({c:"m",e:{c:"v",n:4},p:cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:4},f:"Amount"},null)},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"r",l:cons({n:"1",v:{c:"f",f:plus,a:cons({c:"v",n:2},cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:0}},cons({p:{c:"s",n:false,p:{/*hoho*/c:"v"}},b:{c:"v",n:0}},null))},null))}},cons({n:"2",v:{c:"f",f:plus,a:cons({c:"v",n:1},cons({c:"c",v:1},null))}},null))},null)}},null))}},null)},cons({c:"l",b:{c:"a",f:{c:"a",f:{c:"n",n:2142},x:{c:"v",n:0}},x:{c:"v",n:1}}},null))}},null))}},null))}}}'};
urfuncs[2143] = {c:"t",f:'{c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:""}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))}},b:{c:"f",f:cat,a:cons({c:"c",v:"\\074span class=\\"stack\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:eh,a:cons({c:"v",n:1},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>"},cons({c:"a",f:{c:"n",n:2143},x:{c:"v",n:0}},null))},null))},null))}},null))}}'};
urfuncs[2161] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"l",b:{c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:sb,a:cons({c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:3},f:"Contribs"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"r",l:cons({n:"1",v:{c:"c",v:0}},cons({n:"2",v:{c:"c",v:0}},null))},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},null)}},b:{c:"a",f:{c:"a",f:{c:"n",n:2142},x:{c:"r",l:cons({n:"1",v:{c:"c",v:0}},cons({n:"2",v:{c:"c",v:0}},null))}},x:{c:"v",n:0}}},null))}},null))},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"f",f:sr,a:cons({c:"r",l:cons({n:"EqualPayment",v:{c:"m",e:{c:"f",f:not,a:cons({c:"f",f:le,a:cons({c:"v",n:0},cons({c:"c",v:0},null))},null)},p:cons({p:{c:"c",v:true},b:{c:"f",f:div,a:cons({c:"v",n:1},cons({c:"f",f:float,a:cons({c:"v",n:0},null)},null))}},cons({p:{c:"c",v:false},b:{c:"c",v:0}},null))}},cons({n:"Total",v:{c:"v",n:1}},null))},null)}},null)}},null))},cons({c:"l",b:{c:"f",f:sb,a:cons({c:"v",n:2},cons({c:"l",b:{c:"f",f:sb,a:cons({c:"v",n:4},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"f",f:cat,a:cons({c:"c",v:"\\n\\074div class=\\"flex two\\">\\n\\074div>\\n\\074h4>Total amount \\074span class=\\"label\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:ts,a:cons({c:".",r:{c:"v",n:2},f:"Total"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>\\074/h4>\\n\\074h4>Equal pay \\074span class=\\"label\\">"},cons({c:"f",f:cat,a:cons({c:"f",f:ts,a:cons({c:".",r:{c:"v",n:2},f:"EqualPayment"},null)},cons({c:"f",f:cat,a:cons({c:"c",v:"\\074/span>\\074/h4>\\n\\074/div>\\n"},cons({c:"f",f:cat,a:cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:true},b:{c:"c",v:"\\074button class=\\"tooltip-top\\" data-tooltip=\\"Press the button to view calculation results\\" disabled"}},cons({p:{c:"c",v:false},b:{c:"c",v:"\\074button class=\\"tooltip-top\\" data-tooltip=\\"Press the button to view calculation results\\""}},null))},cons({c:"f",f:cat,a:cons({c:"c",v:" onclick=\'uw_event=event;exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2160},x:{c:"v",n:6}},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:")\'>Next &#x25B6;\\074/button>\\n\\074/div>\\n"},cons({c:"f",f:cat,a:cons({c:"m",e:{c:"v",n:1},p:cons({p:{c:"c",v:null},b:{c:"c",v:""}},cons({p:{/*hoho*/c:"v"},b:{c:"f",f:cat,a:cons({c:"c",v:"\\n\\074article class=\\"card\\">\\n\\074header>\\074h3>Validation errors\\074/h3>\\074/header>\\n\\074section>\\n"},cons({c:"f",f:cat,a:cons({c:"a",f:{c:"n",n:2143},x:{c:"v",n:2}},cons({c:"c",v:"\\n\\074/section>\\n\\074/article>\\n"},null))},null))}},null))},cons({c:"c",v:"\\n"},null))},null))},null))},null))},null))},null))},null))},null))},null))},null))},null)}},null))}},null))}},null))}}}}}'};
urfuncs[2164] = {c:"t",f:'{c:"l",b:{c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:1},f:"Page"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:2020},b:{c:"m",e:{c:"=",e1:{c:"f",f:sb,a:cons({c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:2},f:"Contribs"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:0},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},null)}},b:{c:"a",f:{c:"n",n:2103},x:{c:"v",n:0}}},null))}},null))},cons({c:"l",b:{c:"f",f:sb,a:cons({c:"f",f:sb,a:cons({c:"f",f:ss,a:cons({c:".",r:{c:"v",n:3},f:"Contribs"},null)},cons({c:"l",b:{c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"f",f:sr,a:cons({c:"c",v:0},null)}},cons({p:{c:"s",n:false,p:{c:"r",l:cons({n:"Head",p:{/*hoho*/c:"v"}},null)}},b:{c:"a",f:{c:"n",n:2136},x:{c:"v",n:0}}},null))}},null))},cons({c:"l",b:{c:"=",e1:{c:"m",e:{c:"f",f:lt,a:cons({c:"v",n:1},cons({c:"c",v:2},null))},p:cons({p:{c:"c",v:true},b:{c:"r",l:cons({n:"1",v:{c:"c",v:"Please input at least two persons"}},cons({n:"2",v:{c:"c",v:null}},null))}},cons({p:{c:"c",v:false},b:{c:"c",v:null}},null))},e2:{c:"f",f:sr,a:cons({c:"m",e:{c:"f",f:lt,a:cons({c:"v",n:1},cons({c:"v",n:2},null))},p:cons({p:{c:"c",v:true},b:{c:"r",l:cons({n:"1",v:{c:"c",v:"Please ensure only numbers are input into textboxes"}},cons({n:"2",v:{c:"v",n:0}},null))}},cons({p:{c:"c",v:false},b:{c:"v",n:0}},null))},null)}}},null))}},null))},e2:{c:"r",l:cons({n:"1",v:{c:"f",f:sb,a:cons({c:"v",n:0},cons({c:"l",b:{c:"f",f:sr,a:cons({c:"m",e:{c:"v",n:0},p:cons({p:{c:"c",v:null},b:{c:"c",v:false}},cons({p:{/*hoho*/c:"v"},b:{c:"c",v:true}},null))},null)}},null))}},cons({n:"2",v:{c:"v",n:0}},null))}},p:cons({p:{c:"r",l:cons({n:"1",p:{/*hoho*/c:"v"}},cons({n:"2",p:{/*hoho*/c:"v"}},null))},b:{c:"f",f:sr,a:cons({c:"f",f:cat,a:cons({c:"c",v:"\\n\\074script type=\\"text/javascript\\">dyn(\\"span\\", execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2158},x:{c:"v",n:4}},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:"))\\074/script>\\n\\074br />\\n\\074button onclick=\'uw_event=event;exec("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2159},x:{c:"v",n:4}},x:{c:"c",v:null}}},cons({c:"f",f:cat,a:cons({c:"c",v:")\'>+ Add person\\074/button>\\n\\074br />\\n\\074script type=\\"text/javascript\\">dyn(\\"span\\", execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"a",f:{c:"a",f:{c:"n",n:2161},x:{c:"v",n:4}},x:{c:"v",n:1}},x:{c:"v",n:0}},x:{c:"c",v:null}}},cons({c:"c",v:"))\\074/script>\\n"},null))},null))},null))},null))},null))},null))},null)}},null)}},cons({p:{c:"c",v:2021},b:{c:"f",f:sr,a:cons({c:"f",f:cat,a:cons({c:"c",v:"\\n\\074script type=\\"text/javascript\\">active(execD("},cons({c:"f",f:cat,a:cons({c:"e",e:{c:"a",f:{c:"a",f:{c:"n",n:2163},x:{c:"v",n:2}},x:{c:"c",v:null}}},cons({c:"c",v:"))\\074/script>\\t"},null))},null))},null)}},null))}},null))}}}'};

time_format = "%c";
