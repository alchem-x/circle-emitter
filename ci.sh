#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

pnpm i
npm run build
rm -rf src/main/resources/static
mkdir -p src/main/resources/static
cp dist/* src/main/resources/static/

./gradlew clean build

if [ "$(uname)" == 'Darwin' ];then
    ./pack.sh
else
    mkdir dist
    cp -r src dist/src
fi
