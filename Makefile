ARTICLES_SRC := $(wildcard src/articles/*.ur)
ARTICLES_HTML := $(subst _,-,$(patsubst src/%.ur,%.html,$(ARTICLES_SRC)))
PAGES_SRC := index.ur
PAGES_HTML := $(subst _,-,$(patsubst %.ur,%.html,$(PAGES_SRC)))
STYLES := $(wildcard css/*.css)
STYLES_DIST := $(patsubst %.css,dist/%.css,$(STYLES))

.PHONY: all clean deploy dev

dist:
	git clone https://github.com/ashalkhakov/ashalkhakov.github.com.git --branch master dist
all: dist

bin/dynsite: src/main.urp
	mkdir -p bin
	urweb -path UTIL util src/main

bin/site: src/main.urp
	mkdir -p bin
	urweb -protocol static -path UTIL util src/main

$(PAGES_HTML): bin/site dist
	bin/site /$@ | tail -n+3 > dist/$@
all: $(PAGES_HTML)

articles.html: bin/site dist
	bin/site /$@ | tail -n+3 > dist/$@
all: articles.html
split-calculator.html: bin/site dist
	bin/site /$@ | tail -n+3 > dist/$@
all: split-calculator.html

$(ARTICLES_HTML): bin/site
	mkdir -p dist/articles
	bin/site /$@ | tail -n+3 > dist/$@
all: $(ARTICLES_HTML)

dist/html2pats.html: dist
	cp html2pats.html dist/html2pats.html
all: dist/html2pats.html

dist/css/%.css: css/%.css dist
	mkdir -p dist/css
	cp $< $@
all: $(STYLES_DIST)

dev: all
	cd dist && python -m SimpleHTTPServer 8000

clean:
	rm -rf bin
	cd dist && git reset --hard HEAD

deploy: all
	cd dist && git add --all && git commit -m "Release at \"`date`\"" && git push
