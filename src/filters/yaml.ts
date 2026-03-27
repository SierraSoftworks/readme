import jsYaml from "js-yaml"

export function yaml(value: any): string {
    if (typeof value === "undefined") return ""
    return jsYaml.dump(value, { indent: 2 })
}
