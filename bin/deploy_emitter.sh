#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

cd ..

docker run -d \
  -v "$(pwd):/app" \
  -p 8001:8001 \
  --name circle-emitter \
  openjdk:21 \
  "/app/scripts/start_emitter.sh"
