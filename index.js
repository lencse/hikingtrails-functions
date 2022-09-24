const functions = require('@google-cloud/functions-framework')

functions.http('convert', require('./dist/server/convert/serverless-handler').handler)
