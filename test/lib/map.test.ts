import { MeterDistanceCalculator } from '../../src/map/map'
import {
    DifferenceCalculator,
    DistanceCalculator,
    PathGenerator
} from '../../src/lib/map'
import { LatLon, Path } from '../../src/lib/types'

describe('Distance calculator', () => {
    it('calculates distance between Debrecen and Budapest', () => {
        const calculator = new MeterDistanceCalculator()
        const distance = calculator.getDistance(
            { lat: 47.49801, lon: 19.03991 },
            { lat: 47.53333, lon: 21.63333 }
        )
        expect(distance).toBeCloseTo(195_369.752, 3)
    })
})

class FakeDistanceCalculator implements DistanceCalculator {
    getDistance = (point1: LatLon, point2: LatLon) =>
        Math.abs(point2.lat - point1.lat) + Math.abs(point2.lon - point1.lon) / 100
}

describe('Difference calculator', () => {
    it('calculates positive elevation difference', () => {
        const calculator = new DifferenceCalculator(new FakeDistanceCalculator())
        const delta = calculator.getDifference(
            { lat: 0, lon: 1, elevation: 100.201 },
            { lat: 2, lon: 3, elevation: 105.504 }
        )
        expect(delta).toStrictEqual({
            distance: expect.closeTo(2.02, 3),
            descent: 0,
            rise: expect.closeTo(5.303, 3)
        })
    })

    it('calculates negative elevation difference', () => {
        const calculator = new DifferenceCalculator(new FakeDistanceCalculator())
        const delta = calculator.getDifference(
            { lat: 0, lon: 1, elevation: 100.201 },
            { lat: 2, lon: 3, elevation: 96.123 }
        )
        expect(delta).toStrictEqual({
            distance: expect.closeTo(2.02, 3),
            descent: expect.closeTo(4.078, 3),
            rise: 0
        })
    })
})

describe('Path generator', function () {
    it('generates path correctly', () => {
        const generator = new PathGenerator(new DifferenceCalculator(new FakeDistanceCalculator()))
        const places = [
            { name: 'Place', description: '', position: { lon: 1, lat: 1, elevation: 1 } }
        ]
        const result = generator.generatePath({
            places,
            points: [
                { lat: 0, lon: 0, elevation: 0 },
                { lat: 1, lon: 0, elevation: 2 },
                { lat: 3, lon: 0, elevation: 1 }
            ]
        })
        expect(result).toStrictEqual<Path>({
            places,
            nodes: [
                {
                    delta: { distance: 0, rise: 0, descent: 0 },
                    point: { lat: 0, lon: 0, elevation: 0 }
                },
                {
                    delta: { distance: 1, rise: 2, descent: 0 },
                    point: { lat: 1, lon: 0, elevation: 2 }
                },
                {
                    delta: { distance: 2, rise: 0, descent: 1 },
                    point: { lat: 3, lon: 0, elevation: 1 }
                }
            ]
        })
    })
})
