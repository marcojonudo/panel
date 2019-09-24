#!/usr/bin/env bash

PROJECT_VERSION=$(echo $(git describe --tags) | cut -d '-' -f 1)-$CI_COMMIT_SHORT_SHA
echo $PROJECT_VERSION