#
# Binaries.
#

DUO = node_modules/.bin/duo
DUO-TEST = node_modules/.bin/duo-test -B /build.js
MATCHA = node_modules/.bin/matcha
MOCHA = node_modules/.bin/_mocha

#
# Files.
#

SRCS = $(wildcard lib/*.js)
TESTS = $(wildcard test/*.js)

#
# Program arguments.
#

BROWSER = chrome
MOCHA_OPTS = -R spec

#
# Chore targets.
#

# Remove all temporary/built files.
clean:
	rm -rf build.js
.PHONY: clean

# Remove all temporary/built files and vendor dependencies.
distclean: clean
	rm -rf components node_modules
.PHONY: distclean

# Install node dependencies.
node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install
	@touch node_modules

#
# Build targets.
#

# Build Facade and tests into a testing bundle for duo-test.
build.js: node_modules $(wildcard components/*) $(SRCS) $(TESTS)
	@$(DUO) --development test/index.js > build.js
.DEFAULT_GOAL = build.js

# Run benchmarks against Facade.
bench: node_modules
	@$(MATCHA) bench.js
.PHONY: bench


#
# Test targets.
#

# Run tests locally in Node.
test-node: node_modules
	@$(MOCHA) $(MOCHA_OPTS) $(TESTS)
.PHONY: test-node

# Run tests locally in a browser.
test-browser: node_modules build.js
	@$(DUO-TEST) browser -c make
.PHONY: test-browser

# Run tests locally in PhantomJS.
test-phantomjs: node_modules build.js
	@$(DUO-TEST) $(MOCHA_OPTS) phantomjs
.PHONY: test-phantomjs

# Run tests remotely in Sauce Labs.
test-sauce: node_modules build.js
	@$(DUO-TEST) saucelabs -t facade -b $(BROWSER)
.PHONY: test-sauce

# Shortcut running all test tasks.
test: bench test-node test-phantomjs
