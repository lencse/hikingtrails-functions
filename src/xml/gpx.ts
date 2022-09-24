import { parseXml } from './xml'
import { TrailData } from '../lib/types'

export const pointsAndPlacesFromGpx = async (gpx: string): Promise<TrailData> => {
    const data = await parseXml(gpx)
    return {
        points: data.gpx
            .trk[0]
            .trkseg[0]
            .trkpt
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((node: any) => ({
                lat: Number(node.$.lat),
                lon: Number(node.$.lon),
                elevation: Number(node.ele ?? 0)
            })),
        places: data.gpx
            .wpt
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((node: any) => ({
                position: {
                    lat: Number(node.$.lat),
                    lon: Number(node.$.lon),
                    elevation: 0
                },
                description: String(node.desc[0]),
                name: String(node.name[0])
            }))
    }
}
