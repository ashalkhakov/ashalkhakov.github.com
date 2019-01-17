#!/usr/bin/python3

import sys
import json
import time
import subprocess
import urllib.request
import urllib.parse
from urllib.error import URLError, HTTPError
import os

def main():
    prefix = 'http://localhost:8080/'
    output = 'dist'

    with open('endpoints.json') as json_data:
        data = json.load(json_data)
        endpoints = data['endpoints']
        for ep in endpoints:
            if ep['method'] != 'GET':
                raise ValueError('non-GET endpoints are unsupported')
            path = ep['url']
            src = urllib.parse.urljoin(prefix, path)
            if path[0] != '/':
                dst = output + '/' + path
            else:
                dst = output + path

            directory = os.path.dirname(dst)
            os.makedirs(directory, exist_ok=True)

            print('src = ', src)
            print('dst = ', dst)
            try:
                urllib.request.urlretrieve(src, dst)
            except HTTPError as e:
                if e.code == 404:
                    print('404 on ', src)
                else:
                    raise e
            except URLError as e:
                raise e
            else:
                # do something
                pass

if __name__ == '__main__':
    main()
