
BIN := node_modules/.bin
SRC := $(wildcard lib/*.js)

build.js: $(SRC) node_modules
	$(BIN)/browserify lib/index.js > $@

node_modules: package.json
	npm install
	touch $@

test:
	$(BIN)/mochify --phantomjs $(BIN)/phantomjs --reporter spec test/index.js

clean:
	rm -f build.js

distclean: clean
	rm -rf node_modules

.PHONY: test clean distclean
