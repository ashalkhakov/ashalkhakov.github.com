#!/bin/sh

bin/site &
PID=$!
sleep 1
wget http://localhost:8080/$1 -O dist/$1
echo $! >site.pid
kill $PID
