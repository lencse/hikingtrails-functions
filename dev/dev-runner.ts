import { handler } from '../src/server/convert/serverless-handler'
import express from 'express'
import bodyParser from 'body-parser'

export const main = async () => {
    const app = express()
    app.use(bodyParser.json())
    app.use('/convert', (req, res) => {
        void handler(req, res)
    })
    const port = process.env['PORT'] ?? 5000
    await app.listen(port)
    console.info(`🚀 Listening on http://localhost:${port}`)
}

void main()
