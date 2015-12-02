
all: bundle.js

main.js: main.6.js
	node_modules/.bin/babel main.6.js >main.js

tao.js: tao.6.js
	node_modules/.bin/babel tao.6.js >tao.js

tao.6.js: tao.txt make-tao
	./make-tao

bundle.js: main.js tao.js
	browserify main.js >bundle.js
