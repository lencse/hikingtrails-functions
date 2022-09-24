import { Difference, LatLon, Path, Point, TrailData } from './types'

export class DifferenceCalculator {
    constructor(
        private readonly distanceCalculator: DistanceCalculator
    ) {}

    getDifference = (point1: Point, point2: Point): Difference => {
        const diff = point2.elevation - point1.elevation
        const distance = this.distanceCalculator.getDistance(point1, point2)
        return {
            distance,
            rise: Math.max(diff, 0),
            descent: Math.abs(Math.min(diff, 0))
        }
    }
}

export interface DistanceCalculator {
    getDistance: (point1: LatLon, point2: LatLon) => number
}

export class PathGenerator {
    constructor(
        private readonly differenceCalculator: DifferenceCalculator
    ) {}

    public generatePath = (trail: TrailData): Path => ({
        places: trail.places,
        nodes: trail.points.map((point, idx) => ({
            point,
            delta: idx === 0
                ? { distance: 0, descent: 0, rise: 0 }
                : this.differenceCalculator.getDifference(trail.points[idx - 1] as Point, point)
        }))
    })
}
