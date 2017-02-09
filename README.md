ashalkhakov.github.com
======================

Preparation
-----------

````
git clone https://github.com/ashalkhakov/ashalkhakov.github.com.git --branch master dist
````

Building
--------

````
make -B bin/site
make all
````

This should create the `dist` directory containing everything needed
to deploy the website. Use `make deploy` to deploy the content of
`dist` to `master` branch (that GitHub Pages will be serving as
content).
