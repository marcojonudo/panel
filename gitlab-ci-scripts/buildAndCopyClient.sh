#!/usr/bin/env bash

npm install --quiet
cd client
npm ci
npx ng build
cd ..
/bin/bash gitlab-ci-scripts/copyClientFiles.sh