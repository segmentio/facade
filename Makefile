
BROWSER= firefox,chrome,safari,ie
DUO= node_modules/.bin/duo
DUO-TEST= node_modules/.bin/duo-test
SRC= $(wildcard lib/*.js)

build: $(SRC)
	@$(DUO) --development test/index.js build/build.js

clean:
	rm -rf components build

node_modules: package.json
	@npm install

test: node_modules
	@./node_modules/.bin/mocha \
		--reporter spec

test-browser: build
	@$(DUO-TEST) browser /test --commands make

test-phantom: build
	@$(DUO-TEST) phantomjs /test

test-sauce: build
	@$(DUO-TEST) saucelabs /test -b $(BROWSER)

.PHONY: clean test test-browser
