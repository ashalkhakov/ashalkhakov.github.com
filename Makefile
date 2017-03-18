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

bin/site: src/main.urp
	mkdir -p bin
	urweb -path UTIL util -js split-calculator.js src/main

$(PAGES_HTML): bin/site dist
	./dump.sh $@
all: $(PAGES_HTML)

articles.html: bin/site dist
	./dump.sh $@
all: articles.html

contact.html: bin/site dist
	./dump.sh $@
all: contact.html

projects.html: bin/site dist
	./dump.sh $@
all: projects.html

split-calculator.html: bin/site dist
	./dump.sh $@
all: split-calculator.html
split-calculator.js: bin/site dist
	./dump.sh $@
all: split-calculator.js

$(ARTICLES_HTML): bin/site
	mkdir -p dist/articles
	./dump.sh $@
all: $(ARTICLES_HTML)

dist/html2pats.html: dist
	cp html2pats.html dist/html2pats.html
all: dist/html2pats.html

dist/css/%.css: css/%.css dist
	mkdir -p dist/css
	cp $< $@
all: $(STYLES_DIST)

dist/fj: dist
	cp -Rf fj dist/fj
all: dist/fj

dev: all
	cd dist && python -m SimpleHTTPServer 8000

clean:
	rm -rf bin
	rm -f split-calculator.js
	cd dist && git reset --hard HEAD

deploy: all
	cd dist && git add --all && git commit -m "Release at \"`date`\"" && git push
