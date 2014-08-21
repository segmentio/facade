
BROWSER= firefox
DUO= node_modules/.bin/duo
DUO-TEST= node_modules/.bin/duo-test -B /build.js
SRC= $(wildcard lib/*.js)

build.js: $(SRC)
	@$(DUO) --development test/index.js > build.js

clean:
	rm -rf components build.js

node_modules: package.json
	@npm install

bench:
	@./node_modules/.bin/matcha bench.js

test: bench test-node test-phantom

test-node:
	@./node_modules/.bin/mocha -R spec

test-browser: build.js
	@$(DUO-TEST) browser -c make

test-phantom: build.js
	@$(DUO-TEST) phantomjs

test-sauce: build.js
	@$(DUO-TEST) saucelabs -t facade -b $(BROWSER)

.PHONY: clean test test-browser bench test-phantom test-sauce
