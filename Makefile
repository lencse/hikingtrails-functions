.PHONY: dev verify lint lint-fix types depcheck test watch-test test-coverage

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

NODE_DEPS=node_modules
BIN=$(NODE_DEPS)/.bin
TSC=$(BIN)/tsc
DIST=dist

default: $(DIST)

verify: types lint test-coverage depcheck

$(TSC): package.json yarn.lock
	yarn --immutable --frozen-lockfile --ignore-scripts --non-interactive \
		&& touch $(TSC)

$(DIST): $(TSC)
	$(TSC) -p ./src --pretty

.env: .env.development
	cp .env.development .env

dev: $(TSC)
	$(BIN)/nodemon

watch-test: $(TSC)
	$(BIN)/jest --watch

test: $(TSC)
	$(BIN)/jest --verbose

test-coverage: $(TSC)
	$(BIN)/jest --verbose --coverage

types: $(TSC)
	$(BIN)/tsc --noEmit -p .

lint: $(TSC)
	$(BIN)/eslint .

lint-fix: $(TSC)
	$(BIN)/eslint . --fix

depcheck: $(TSC)
	$(BIN)/depcheck --ignores="depcheck,nodemon,ts-node,@types/jest"

deploy-file-converter:
	DEPLOY_SERVICE=convert ./deploy.sh

before-commit: lint-fix verify
