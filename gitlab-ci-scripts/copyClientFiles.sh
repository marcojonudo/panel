#!/usr/bin/env bash

mkdir -p server/build/resources/main/static
cp -R client/dist/client/* server/build/resources/main/static
chmod -R o+w server/build/resources/main/static