export const singleton = <T>(di: T) => {
    const instances: {[k in keyof T]?: unknown} = {}
    for (const k of Object.keys(di)) {
        const key = k as keyof T
        const original = di[key]
        if (typeof original !== 'function') {
            continue
        }
        const bound = original.bind(di)
        // @ts-expect-error key will be a key of T
        di[key] = () => {
            if (!instances[key]) {
                instances[key] = bound()
            }
            return instances[key]
        }
    }
    return di
}
