export type LatLon = {
    lat: number
    lon: number
}

export type Point = LatLon & {
    elevation: number
}

export type Difference = {
    distance: number
    rise: number
    descent: number
}

export type PathNode = HasDeltaFromPrevious & {
    point: Point
}

export type HasDeltaFromPrevious = {
    delta: Difference
}

export type Path = {
    nodes: PathNode[]
    places: Place[]
}

type Place = {
    name: string
    description: string
    position: Point
}

export type TrailData = {
    points: Point[]
    places: Place[]
}
