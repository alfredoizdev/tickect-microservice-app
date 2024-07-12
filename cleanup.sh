#!/bin/bash

# Remove all Docker images that start with 'alfredoizjr/'
docker images | grep 'alfredoizjr/' | awk '{print $3}' | xargs docker rmi -f

echo "Cleanup complete."