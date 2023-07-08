#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

APP_NAME=CircleEmitter
jpackage --input build/libs \
         --name "$APP_NAME" \
         --main-jar circle-emitter.jar \
         --vendor alchem-x \
         --app-version 1.0.0 \
         --type app-image \
         --dest build \
         --icon icons/Check.icns \
         --java-options -DAPP=UI \
         --java-options -Dapple.awt.UIElement=true \
         --java-options -Dapple.awt.application.name="$APP_NAME" \
         --mac-package-identifier alchem.ce \
         --verbose
