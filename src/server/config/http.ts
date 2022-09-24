import { getenv } from './getenv'

export const httpConfig = () => ({
    useFake: getenv('USE_FAKE_HTTP', 'false') === 'true'
})
