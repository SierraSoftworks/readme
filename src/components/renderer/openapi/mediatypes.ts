import Vue from "vue"
import Component from "vue-class-component"
import * as yaml from "js-yaml"
import Markdown from "../markdown"
import * as template from "text!./mediatypes.html"
import Highlight from "../../highlight";
import { OpenAPIMediaType, OpenAPISchema, OpenAPIParameter, OpenAPIHeader } from "../../../formats/openapi";
import { generateExampleXML } from "./xml"

@Component({
    name: "openapi-mediatypes",
    template,
    components: {
        markdown: Markdown,
        highlight: Highlight,
    },
    props: {
        mode: {
            type: String,
            validator(value) {
                return !!~["read", "write"].indexOf(value)
            }
        },
        content: {
            type: Object,
            required: true
        },
        contentType: {
            type: String,
            required: false
        }
    }
})
export default class OpenAPIMediaTypesView extends Vue {
    content!: { [contentType: string]: OpenAPIMediaType }
    contentType!: string
    mode!: "read" | "write"

    get media(): OpenAPIMediaType {
        return this.content[this.contentType]
    }

    example(schema: OpenAPISchema, mode: "read" | "write"): any {
        if (schema.readOnly && mode !== "read") return
        if (schema.writeOnly && mode !== "write") return
        if (schema.example) return schema.example

        switch (schema.type || "object") {
            case "array":
                return [this.example(schema.items, mode)].filter(x => typeof x !== "undefined")
            case "object":
                return Object.assign({}, ...Object.keys(schema.properties || {}).map(k => {
                    const example = this.example(schema.properties[k], mode)
                    if (!example) return {}
                    return { [k]: example }
                }))
        }

        return undefined
    }

    renderExample(schema: OpenAPISchema, mode: "read" | "write"): string {
        const example = this.example(schema, mode)

        switch (this.renderLanguage) {
            case "json": return JSON.stringify(example, null, 2)
            case "xml": return generateExampleXML(schema, mode)
            case "yaml": return yaml.safeDump(example, { indent: 2 })
        }

        return example
    }

    get renderLanguage(): string {
        if (~this.contentType.indexOf("application/json")) return "json"
        if (~this.contentType.indexOf("xml")) return "xml"
        if (~this.contentType.indexOf("html")) return "html"
        if (~this.contentType.indexOf("yaml")) return "yaml"

        return null
    }
}