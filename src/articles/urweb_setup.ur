open Tagffi

fun
main (nav: list {Title : string, Link : url}): transaction page =
return (
Template.template_main {
Title= "Underivable - Setting up Ur/Web for development on Ubuntu 16.10",
Navigation = nav,
Page= <xml>
  <h1>Preface</h1>
  <p>It can take a while to wade through the docs about SML
    toolchain because it isn't very mainstream. Also, I think that
    automating dev box setup is very useful. Let's get started; you'll
    need an Ubuntu 16.10 box.
  </p>

  <h1>The setup</h1>
  <p>Below, we are setting up everything to be able to compile
    Ur/Web from sources.
  </p>

  <pre><code>sudo apt-get install emacs-goodies-el
sudo apt-get install build-essential git mlton autoconf libssl-dev
sudo apt-get install libpq-dev libmysqlclient-dev libsqlite3-dev
git clone https://github.com/urweb/urweb.git
cd urweb
./autogen.sh
# we install this in order to have the emacs modes ready
apt-get install emacs-goodies-el
./configure
make
sudo make install
# install a mode for emacs
touch ~/.emacs
echo '(add-to-list '"'"'load-path "/usr/local/share/emacs/site-lisp/urweb-mode")' &gt;&gt; ~/.emacs
echo '(load "urweb-mode-startup")' &gt;&gt; ~/.emacs</code></pre>

<p>Next, we'll be setting up Emacs to work with MLton using the
  corresponding
  tools: <a href="http://mlton.org/EmacsDefUseMode">Def-Use Mode</a>
  (allows Emacs to parse a pre-existing def-use file and use the
  information to allow user to jump from uses to definitions)
  and <a href="http://mlton.org/EmacsBgBuildMode">Bg-Build</a>
  (allows Emacs to invoke a build tool in background as soon as a
  source file is changed, refreshing the def-use file).
</p>

<pre><code>cd
git clone https://github.com/ramLlama/mlton-emacs
echo "(add-to-list 'load-path \"`pwd`/mlton-emacs/\")" &gt;&gt; ~/.emacs
echo "(require 'esml-du-mlton)" &gt;&gt; ~/.emacs
echo "(def-use-mode)" &gt;&gt; ~/.emacs
echo "(require 'bg-build-mode)" &gt;&gt; ~/.emacs
echo "(bg-build-mode)" &gt;&gt; ~/.emacs</code></pre>

<p>Finally, please fire-up Emacs and do the following:</p>
<ul>
  <li><strong><code>M-x package-list-packages</code></strong></li>
  <li><strong><code>C-x s sml-mode</code></strong></li>
  <li>Hit <strong><code>i</code></strong>
    then <strong><code>x</code></strong></li>
    <li>Finally, answer positively to any prompts</li>
</ul>

<h1>How to use <code>bg-build</code>?</h1>

<p>In Emacs, please do the following:</p>
<ul>
  <li><strong><code>M-x bg-build-add-project</code></strong></li>
  <li>then point it to urweb's <strong><code>build.bgb</code></strong></li>
  <li>Finally: <strong><code>M-x esml-du-mlton</code></strong> and navigate to the <code>compiler.du</code> file</li>
</ul>
</xml>
})
