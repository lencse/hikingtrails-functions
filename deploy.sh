#!/usr/bin/env bash

set -e

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
    --memory=2048MB \
    --set-env-vars=NODE_ENV=production \
    --max-instances=1
