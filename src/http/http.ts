import axios from 'axios'
import { fileContent } from '../files/files'
import { resolve } from 'path'

export interface HttpClient {
    get: (url: string) => Promise<string>
}

export class RealHttpClient implements HttpClient {
    public async get(url: string): Promise<string> {
        const res = await axios.get(url)
        return res.data.toString()
    }
}

export class FakeHttpClient implements HttpClient {
    public async get(url: string): Promise<string> {
        const fileName = url.split('/').pop() as string
        return await fileContent(resolve('src/server/http/fake', fileName))
    }
}
