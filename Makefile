
SRC= $(wildcard lib/*.js)

build: $(SRC)
	@duo -d test/index.js build/build.js

clean:
	rm -rf components build

node_modules: package.json
	@npm install

test: node_modules
	@./node_modules/.bin/mocha \
		--reporter spec

test-browser: build
	@open test/index.html

.PHONY: clean test test-browser
