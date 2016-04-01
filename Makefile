
BIN := node_modules/.bin

SRC := $(wildcard lib/*.js)
TESTS := $(wildcard test/*.js)

dist/index.js: $(SRC) dist node_modules
	$(BIN)/browserify lib/index.js > $@

dist:
	mkdir -p $@

node_modules: package.json
	npm install
	touch $@

test:
	$(BIN)/mochify --phantomjs $(BIN)/phantomjs --reporter spec test/index.js

clean:
	rm -rf dist

distclean: clean
	rm -rf node_modules

.PHONY: test clean distclean
