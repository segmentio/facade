
SRC= $(wildcard lib/*.js)

build: components $(SRC)
	@component build --dev

components: component.json
	@component install --dev

test: node_modules
	@./node_modules/.bin/mocha \
		--reporter spec

node_modules: package.json
	@npm install

test-browser: build
	@open test/index.html

clean:
	rm -rf components build

.PHONY: test clean test-browser
