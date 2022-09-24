import { LatLon } from '../lib/types'
import { getPreciseDistance } from 'geolib'
import { DistanceCalculator } from '../lib/map'

export class MeterDistanceCalculator implements DistanceCalculator {
    getDistance = (point1: LatLon, point2: LatLon) => getPreciseDistance(
        { longitude: point1.lon, latitude: point1.lat },
        { longitude: point2.lon, latitude: point2.lat },
        0.001
    )
}
