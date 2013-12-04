
SRC= $(wildcard lib/*.js)

build: components $(SRC)
	@component build --dev

components: component.json
	@component install --dev

test:
	@./node_modules/.bin/mocha \
		--reporter spec

clean:
	rm -rf components build

.PHONY: test clean
