.PHONY: init
init:
	make ui-install
	make backend-install
	docker compose up -d
	make govtool-install

.PHONY: up
up:
	docker compose up -d
	make govtool-install

.PHONY: down
down:
	docker compose down

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
		node:20-alpine yarn install --ignore-engine

.PHONY: govtool-install
govtool-install:
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