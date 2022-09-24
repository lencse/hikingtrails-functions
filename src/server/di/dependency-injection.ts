import { config } from '../config/config'
import { FakeHttpClient, RealHttpClient } from '../../http/http'
import { singleton } from './singleton'
import { MeterDistanceCalculator } from '../../map/map'
import { DifferenceCalculator, PathGenerator } from '../../lib/map'

export class DependencyInjection {
    constructor(
        private readonly conf: typeof config
    ) {}

    public httpClient = () => this.conf.httpConfig().useFake
        ? new FakeHttpClient()
        : new RealHttpClient()

    public distanceCalculator = () => new MeterDistanceCalculator()

    public differenceCalculator = () => new DifferenceCalculator(this.distanceCalculator())

    public pathGenerator = () => new PathGenerator(this.differenceCalculator())
}

export const createDI = (conf: typeof config) => {
    const result = new DependencyInjection(conf)
    singleton(result)
    return result
}
