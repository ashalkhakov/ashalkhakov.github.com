#!/bin/bash

APP=demo
URWEB=urweb
TESTSRV=./$APP.exe
TESTPID=/tmp/$APP.pid

rm $TESTPID
$URWEB -debug -boot -noEmacs $APP || exit 1
$TESTSRV -q -a 127.0.0.1 &
echo $! >> $TESTPID
sleep 1
xsltproc atom-sch1-5-rules.xsl http://localhost:8080/Demo/atom
xmllint --noout --relaxng atom.rng http://localhost:8080/Demo/atom
kill `cat $TESTPID`
