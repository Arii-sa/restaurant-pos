#!/bin/bash
set -e

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "Generating app key..."
php artisan key:generate --force

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Clearing and caching config..."
php artisan config:clear
php artisan config:cache
php artisan route:cache

echo "Creating storage link..."
php artisan storage:link

echo "Build complete!"
