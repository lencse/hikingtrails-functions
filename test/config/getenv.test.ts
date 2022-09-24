import { getenv } from '../../src/server/config/getenv'

describe('Get env', () => {
    it('retrieves the correct env variable', () => {
        process.env['TEST'] = 'test'
        const result = getenv('TEST')
        expect(result).toEqual('test')
    })

    it('throws exception on missing env variable', () => {
        expect(() => getenv('UNDEFINED')).toThrow('UNDEFINED env var not set')
    })

    it('retrieves default value if environment variable is not set', () => {
        const result = getenv('UNDEFINED', 'default')
        expect(result).toEqual('default')
    })

    it('ignores default value if environment variable is set', () => {
        process.env['TEST'] = 'test'
        const result = getenv('TEST', 'default')
        expect(result).toEqual('test')
    })
})
