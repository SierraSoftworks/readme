import jsYaml from "js-yaml"

export function yaml(value: any): string | undefined {
    if (typeof value === "undefined") return undefined
    return jsYaml.dump(value, { indent: 2 })
}
