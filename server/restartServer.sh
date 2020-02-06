#!/bin/sh
[ -z "$DOCKERHUB_USERNAME" ] || (echo "Define the dockerhub username!" && exit)
[ -z "$DOCKER_IMAGE_NAME" ] || (echo "Define the dockerhub image name!" && exit)
[ -z "$CIRCLE_BRANCH" ] || (echo "Define the branch name!" && exit)
[ -z "$CIRCLE_SHA1" ] || (echo "Define the commit hash!" && exit)
[ -z "$SERVICE_NAME" ] || (echo "Define the service name!" && exit)
docker image ls | grep "$DOCKERHUB_USERNAME"/"$DOCKER_IMAGE_NAME":*
docker rmi $(docker image ls | "$DOCKERHUB_USERNAME"/"$DOCKER_IMAGE_NAME")
docker service update --image "$DOCKERHUB_USERNAME"/"$DOCKER_IMAGE_NAME":"$CIRCLE_BRANCH"-"$CIRCLE_SHA1" "$SERVICE_NAME"