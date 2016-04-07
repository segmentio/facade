
BIN := node_modules/.bin
SRC := $(wildcard lib/*.js)
TESTS = $(wildcard test/*.js)

build.js: $(SRC) node_modules
	$(BIN)/browserify lib/index.js > $@

node_modules: package.json
	npm install
	touch $@

test: lint test-node test-phantomjs

lint: node_modules
	$(BIN)/eslint $(SRC) $(TESTS)

test-phantomjs:
	$(BIN)/mochify --phantomjs $(BIN)/phantomjs --reporter spec test/index.js

test-node:
	$(BIN)/mocha

coverage: $(SRC) $(TESTS) node_modules
	$(BIN)/istanbul cover --include-comments -x "**/components/**" -x "**/build.js" $(BIN)/_mocha

check-coverage: coverage
	$(BIN)/istanbul check-coverage --statements 95 --functions 95 --branches 89 --lines 95

clean:
	rm -f build.js

distclean: clean
	rm -rf node_modules

.PHONY: test test-node test-phantomjs clean distclean check-coverage
