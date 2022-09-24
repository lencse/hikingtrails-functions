#!/usr/bin/env bash

set -e

PUBSUB_TOPIC=test-topic-2
GCLOUD_BUCKET=hbt-data-staging

GCLOUD_PROJECT_STAGING=hungarian-blue-trail-staging
GCLOUD_PROJECT_PROD=hungarian-blue-trail
GCLOUD_REGION=europe-central2
GCLOUD_FUNCTIONS_RUNTIME=nodejs16

GRAPHQL_FUNCTION_NAME=graphql
GRAPHQL_HANDLER_ENTRYPOINT=graphql
GRAPHQL_MEMORY_CONFIG=1024MB
GRAPHQL_TIMEOUT_CONFIG=30s
GRAPHQL_MAX_INSTANCES_CONFIG=3

WORKER_FUNCTION_NAME=worker
WORKER_HANDLER_ENTRYPOINT=worker
WORKER_MEMORY_CONFIG=256MB
WORKER_TIMEOUT_CONFIG=540s
WORKER_MAX_INSTANCES_CONFIG=2

if [ "$GCLOUD_LOGGED_IN" != "true" ]; then
    echo ""
    echo "››› Login to gcloud"
    echo ""

    mkdir -p .tmp
    echo "$GCLOUD_SERVICE_ACCOUNT" | base64 -d > .tmp/gcloud.json
    gcloud auth activate-service-account --key-file=.tmp/gcloud.json
    rm .tmp/gcloud.json
fi

set -x

gcloud config set project hikingtrails-hu --quiet

gcloud functions deploy --gen2 convert \
    --region=europe-central2 \
    --runtime=nodejs16 \
    --source=. \
    --entry-point=convert \
    --trigger-http \
    --allow-unauthenticated \
    --timeout=30s \
    --memory=1024MB \
    --set-env-vars=NODE_ENV=production \
    --max-instances=1
