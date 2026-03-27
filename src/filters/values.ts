export function defaultValue(value: any, def: any) {
    return (value === null || value === undefined) ? def : value
}
