#!/usr/bin/env bash

version=$(git describe --tags)

if [ $CI_MERGE_REQUEST_LABELS == "major" ]; then
    majorVersion=$(echo $version | cut -d '.' -f 1)
	majorVersion=${majorVersion:1:1}
	updatedVersion=$((majorVersion+1)).0.0
elif [ $CI_MERGE_REQUEST_LABELS == "minor" ]; then
    minorVersion=$(echo $version | cut -d '.' -f 2)
	updatedVersion=$(echo $version | cut -d '.' -f 1).$((minorVersion+1)).0
else
	patchVersion=$(echo $version | cut -d '.' -f 3)
	updatedVersion=$(echo $version | cut -d '.' -f 1).$(echo $version | cut -d '.' -f 2).$((patchVersion+1))
fi

echo $updatedVersion