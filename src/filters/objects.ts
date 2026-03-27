export function get(value: any, path: string): any {
    if (!path) return value
    return path.split(".").reduce((value, path) => {
        if (value === undefined) return undefined
        if (Array.isArray(value)) {
            try {
                return value[parseInt(path)]
            } catch (e) {}
        }
        return value[path]
    }, value)
}

export function exclude(obj: Record<string, any>, ...fields: string[]) {
    return Object.keys(obj).filter(f => !~fields.indexOf(f)).reduce((obj2: Record<string, any>, k) => {
        obj2[k] = obj[k]
        return obj2
    }, {})
}
