
node_modules:
	@npm install

test: node_modules
	@./node_modules/.bin/mocha \
		--reporter spec

.PHONY: test
