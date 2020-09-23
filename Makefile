##
# Tasks
##

# Install dependencies.
install:
	yarn install --frozen-lockfile


# Default test target.
test: 
	yarn jest
.PHONY: test
.DEFAULT_GOAL = test

docs: install
	@./node_modules/.bin/documentation build --github --format html --output docs lib/**
.PHONY: docs
