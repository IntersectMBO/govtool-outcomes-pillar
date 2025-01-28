.PHONY: init
init:
	make ui-install
	make backend-install
	chmod -R 777 ./start-govtool.sh
	./start-govtool.sh
	docker compose up 

.PHONY: up
up:
	docker compose up 

.PHONY: down
down:
	docker compose down

.PHONY: update-govtool
update-govtool:
	./start-govtool.sh true

.PHONY: ui-install
ui-install:
	make ui-clean
	docker run --rm --interactive --tty \
		--volume ${PWD}/ui/:/app \
		--workdir /app \
		--user root \
		node:20-alpine yarn install --ignore-engine

.PHONY: backend-install
backend-install:
	make backend-clean
	docker run --rm --interactive --tty \
		--volume ${PWD}/backend/:/app \
		--workdir /app \
		--user root \
		node:22-alpine yarn install --ignore-engine

.PHONY: govtool-install
govtool-install:
	rm -rf govtool/frontend/node_modules 2>/dev/null || true
	docker run --rm --interactive --tty \
		--volume ${PWD}/govtool/frontend/:/app \
		--workdir /app \
		--user root \
		node:20-alpine yarn install --ignore-engine

.PHONY: backend-clean
backend-clean:
	rm -rf backend/node_modules 2>/dev/null || true

.PHONY: ui-clean
ui-clean:
	rm -rf ui/node_modules 2>/dev/null || true

.PHONY: image-build-ui
image-build-ui:
	docker build \
	-f ui/Dockerfile.dev \
	-t outcomes-pillar-ui \
	ui/.

.PHONY: image-build-backend
image-build-backend:
	docker build \
	-f backend/Dockerfile.dev \
	-t outcomes-pillar-backend \
	backend/.

.PHONY: image-build-govtool
image-build-govtool:
	docker build \
	-f ./Dockerfile.govtool \
	-t govtool_frontend \
	.