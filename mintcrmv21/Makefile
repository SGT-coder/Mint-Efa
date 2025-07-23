.PHONY: help install migrate seed run test clean docker-build docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  migrate     - Run database migrations"
	@echo "  seed        - Seed database with sample data"
	@echo "  run         - Run development server"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean up temporary files"
	@echo "  docker-build - Build Docker containers"
	@echo "  docker-up   - Start Docker containers"
	@echo "  docker-down - Stop Docker containers"

install:
	pip install -r requirements.txt

migrate:
	python manage.py makemigrations
	python manage.py migrate

seed:
	python manage.py shell < scripts/seed_data.py

run:
	python manage.py runserver

test:
	python manage.py test

clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
