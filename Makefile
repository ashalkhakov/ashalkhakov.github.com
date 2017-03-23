ARTICLES_SRC := $(wildcard src/articles/*.ur)
ARTICLES_HTML := $(subst _,-,$(patsubst src/%.ur,%.html,$(ARTICLES_SRC)))
PAGES_SRC := index.ur
PAGES_HTML := $(subst _,-,$(patsubst %.ur,%.html,$(PAGES_SRC)))
STYLES := $(wildcard css/*.css)
STYLES_DIST := $(patsubst %.css,dist/%.css,$(STYLES))

.PHONY: all clean test

bin/site: src/main.urp
	mkdir -p bin
	urweb -protocol static src/main

$(PAGES_HTML): bin/site
	mkdir -p dist
	bin/site /$@ | tail -n+3 > dist/$@
all: $(PAGES_HTML)

$(ARTICLES_HTML): bin/site
	mkdir -p dist/articles
	bin/site /$@ | tail -n+3 > dist/$@
all: $(ARTICLES_HTML)

dist/html2pats.html:
	mkdir -p dist
	cp html2pats.html dist/html2pats.html
all: dist/html2pats.html

dist/css/%.css: css/%.css
	mkdir -p dist/css
	cp $< $@
all: $(STYLES_DIST)

clean:
	rm -rf bin
	rm -rf dist
