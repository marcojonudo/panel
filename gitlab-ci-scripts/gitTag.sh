mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keyscan gitlab.com >> ~/.ssh/known_hosts && chmod 644 ~/.ssh/known_hosts
eval $(ssh-agent -s)
ssh-add <(echo "$SSH_PRIVATE_KEY")
PROJECT_VERSION=$(cat ./version)
PUSH_URL=$(echo $CI_REPOSITORY_URL | sed 's+.*gitlab.com/+git@gitlab.com:+g')
echo Updating project from $CURRENT_VERSION to $PROJECT_VERSION
echo Pushing to $PUSH_URL
git remote set-url --push origin $PUSH_URL
git tag $PROJECT_VERSION
git push origin $PROJECT_VERSION