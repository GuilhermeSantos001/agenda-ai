env:
	@bash setup/env.sh

database:
	docker compose -f docker-compose.yml up -d mongodb
	docker compose -f docker-compose.yml up -d redis
	docker compose -f docker-compose.yml up -d rabbitmq

db-push:
	yarn prisma db push

up:
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

prune:
	docker system prune -af --volumes --force
