import { RealHttpClient } from '../../src/http/http'
import { createServer } from 'http'
import { findFreePorts } from 'find-free-ports'

describe('HTTP Get', () => {
    it('returns response body', async () => {
        const port = (await findFreePorts(1))[0] as number
        const server = createServer((req, res) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('Test')
        }).listen(port)
        const client = new RealHttpClient()
        const response = await client.get(`http://localhost:${port}`)
        expect(response).toBe('Test')
        await server.close()
    })
})
