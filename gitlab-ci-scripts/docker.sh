docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY
PROJECT_VERSION=$(cat ./version)
echo $PROJECT_VERSION
cd server
docker build -t $CI_REGISTRY_IMAGE .
docker tag $CI_REGISTRY_IMAGE:latest $CI_REGISTRY_IMAGE:$PROJECT_VERSION
docker push $CI_REGISTRY_IMAGE:latest
docker push $CI_REGISTRY_IMAGE:$PROJECT_VERSION