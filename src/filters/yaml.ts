import Vue from "vue"
import * as jsYaml from "js-yaml"

const yaml = Vue.filter("yaml", value => {
    if (typeof value === "undefined") return undefined
    return jsYaml.safeDump(value, { indent: 2 })
})

export {
    yaml
}