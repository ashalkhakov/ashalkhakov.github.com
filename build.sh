#!/bin/bash

set -e

TESTPID=/tmp/mysite.pid

if [ ! -d "dist" ]; then
    git clone git@github.com:ashalkhakov/ashalkhakov.github.com.git --branch master dist
fi

# remove the old files
mv dist/.git dist.git && rm -rf dist/* && mv dist.git dist/.git

# compile
mkdir -p bin
urweb -path UTIL util -path UWP uwp -endpoints endpoints.json src/main

# create the new files
rm $TESTPID
bin/site -q &
echo $! >> $TESTPID
sleep 1
python3 dump.py
kill `cat $TESTPID`
