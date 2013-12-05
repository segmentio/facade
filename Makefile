
node_modules:
	@npm install
	@touch node_modules

test: node_modules
	@./node_modules/.bin/mocha --reporter spec

.PHONY: test
