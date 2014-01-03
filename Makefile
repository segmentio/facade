
SRC= $(wildcard lib/*.js)

build: components $(SRC)
	@component build --dev

clean:
	rm -rf components build

components: component.json
	@component install --dev

node_modules: package.json
	@npm install

test: node_modules
	@./node_modules/.bin/mocha \
		--reporter spec

test-browser: build
	@open test/index.html

.PHONY: clean test test-browser