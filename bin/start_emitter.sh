#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

cd ..

if [ -f .env ]; then
    . .env
fi

exec java -Xms20m -Xmx20m -jar build/libs/circle-emitter.jar "$@"
