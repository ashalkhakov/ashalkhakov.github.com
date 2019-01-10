# The `feed` library

It's a tiny library for producing [Atom syndication
format](https://tools.ietf.org/html/rfc4287) feeds in
[Ur/Web](http://www.impredicative.com/ur/).

# Usage

Please see `demo.ur`.

# Tests

* install `xmllint` (it is located in `libxml2-utils` package on
  Ubuntu)
* run `demo.sh`: it will build and validate the produced feed

# Credits

Thanks to [Christian
Weiske](https://cweiske.de/tagebuch/atom-validation.htm) for teaching
me how to validate Atom feeds locally (this is also where I got the
`atom.rng` file).
