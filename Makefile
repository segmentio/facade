
BROWSER= firefox
DUO= node_modules/.bin/duo
DUO-TEST= node_modules/.bin/duo-test
SRC= $(wildcard lib/*.js)

build: $(SRC)
	@$(DUO) --development test/index.js build/build.js

clean:
	rm -rf components build

node_modules: package.json
	@npm install

bench:
	@./node_modules/.bin/matcha bench.js

test: test-node test-phantom

test-node:
	@./node_modules/.bin/mocha -R spec

test-browser: build
	@$(DUO-TEST) browser /test --commands make

test-phantom: build
	@$(DUO-TEST) phantomjs /test

test-sauce: build
	@$(DUO-TEST) saucelabs /test -n facade -b $(BROWSER)

.PHONY: clean test test-browser bench test-phantom test-sauce
