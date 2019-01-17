.PHONY: all clean deploy dev

bin/site::
	./build.sh
all: bin/site

dist/html2pats.html:
	cp html2pats.html dist/html2pats.html
all: dist/html2pats.html

dist/fj:
	cp -Rf fj dist/fj
all: dist/fj

clean:
	rm -rf bin
	cd dist && git reset --hard HEAD

deploy: all
	cd dist && git add --all && git commit -m "Release at \"`date`\"" && git push
