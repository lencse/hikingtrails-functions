import { parseXml, toplLevelXmlElementName } from '../../src/xml/xml'
import { pointsAndPlacesFromGpx } from '../../src/xml/gpx'
import { TrailData } from '../../src/lib/types'

describe('XML', () => {
    it('parses XML', async () => {
        const xml = '<foo value="1"><bar>test</bar></foo>'
        const result = await parseXml(xml)
        expect(result.foo.$.value).toBe('1')
        expect(result.foo.bar).toEqual(['test'])
    })

    it('throws exception on XML error', async () => {
        const xml = '<xml>Invalid XML'
        await expect(async () => {
            await parseXml(xml)
        }).rejects.toThrow()
    })

    it('finds top level element correctly', async () => {
        const xml = '<foo value="1"><bar>test</bar></foo>'
        const result = await toplLevelXmlElementName(xml)
        expect(result).toStrictEqual('foo')
    })
})

describe('Points and places from GPX', () => {
    it('Parses GPX', async () => {
        const gpx = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx>
                <metadata>
                    <name>test</name>
                </metadata>
                <wpt lat="10" lon="11">
                    <name>Test point 1</name>
                    <desc>First test point</desc>
                </wpt>
                <wpt lat="12" lon="13">
                    <name>Test point 2</name>
                    <desc>Second test point</desc>
                </wpt>
                <trk>
                    <name>test</name>
                    <desc></desc>
                    <trkseg>
                        <trkpt lat="1" lon="0"><ele>1</ele></trkpt>
                        <trkpt lat="1" lon="1"><ele>2</ele></trkpt>
                        <trkpt lat="2" lon="2"><ele>3</ele></trkpt>
                    </trkseg>
                </trk>
            </gpx>
        `
        const result = await pointsAndPlacesFromGpx(gpx)
        expect(result).toStrictEqual<TrailData>({
            places: [
                {
                    name: 'Test point 1',
                    description: 'First test point',
                    position: { lat: 10, lon: 11, elevation: 0 }
                },
                {
                    name: 'Test point 2',
                    description: 'Second test point',
                    position: { lat: 12, lon: 13, elevation: 0 }
                }
            ],
            points: [
                { lat: 1, lon: 0, elevation: 1 },
                { lat: 1, lon: 1, elevation: 2 },
                { lat: 2, lon: 2, elevation: 3 }
            ]
        })
    })
})
