#!/bin/bash

APP=demo
URWEB=urweb
TESTSRV=./$APP.exe
TESTPID=/tmp/$APP.pid

$URWEB -debug -boot -noEmacs $APP || exit 1
$TESTSRV -q -a 127.0.0.1 &
echo $! >> $TESTPID
sleep 1
xmllint --noout --relaxng atom.rng http://localhost:8080/Demo/atom
kill `cat $TESTPID`
