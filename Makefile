bin/site: src/main.urp
	mkdir -p bin
	urweb -protocol static src/main

main.html: bin/site
	bin/site /main.html | tail -n+3 > $@
all:: main.html

urweb-setup.html: bin/site
	bin/site /urweb-setup.html | tail -n+3 > $@
all:: urweb-setup.html

cleanall::
	rm -rf bin
	rm main.html
	rm urweb-setup.html
