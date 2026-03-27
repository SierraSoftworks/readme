<template>
    <div>
        <Highlight v-if="media && example(media.schema, mode)" :value="renderExample(media.schema, mode)"
            :lang="renderLanguage">
        </Highlight>

        <h5 v-if="media && media.schema">Schema</h5>
        <Highlight v-if="media && media.schema" :value="yamlFilter(media.schema)" lang="yaml">
        </Highlight>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import jsYaml from "js-yaml"
import type { OpenAPIMediaType, OpenAPISchema } from "@/formats/openapi"
import Highlight from "@/components/Highlight.vue"
import { generateExampleXML } from "./xml"

export default defineComponent({
    name: "OpenAPIMediaTypes",
    components: { Highlight },
    props: {
        mode: {
            type: String as () => "read" | "write",
            validator(value: string) {
                return ["read", "write"].includes(value)
            }
        },
        content: {
            type: Object as () => { [contentType: string]: OpenAPIMediaType },
            required: true
        },
        contentType: {
            type: String,
            required: false
        }
    },
    computed: {
        media(): OpenAPIMediaType | undefined {
            if (!this.contentType) return undefined
            return this.content[this.contentType]
        },
        renderLanguage(): string | null {
            if (!this.contentType) return null
            if (~this.contentType.indexOf("application/json")) return "json"
            if (~this.contentType.indexOf("xml")) return "xml"
            if (~this.contentType.indexOf("html")) return "html"
            if (~this.contentType.indexOf("yaml")) return "yaml"
            return null
        }
    },
    methods: {
        yamlFilter(value: any): string {
            if (typeof value === "undefined") return ""
            return jsYaml.dump(value, { indent: 2 })
        },
        example(schema: OpenAPISchema, mode: "read" | "write"): any {
            if (!schema) return undefined
            if (schema.readOnly && mode !== "read") return undefined
            if (schema.writeOnly && mode !== "write") return undefined
            if (schema.example) return schema.example

            switch (schema.type || "object") {
                case "array":
                    return [this.example(schema.items as OpenAPISchema, mode)].filter(x => typeof x !== "undefined")
                case "object":
                    return Object.assign({}, ...Object.keys(schema.properties || {}).map(k => {
                        const example = this.example(schema.properties![k] as OpenAPISchema, mode)
                        if (!example) return {}
                        return { [k]: example }
                    }))
            }

            return undefined
        },
        renderExample(schema: OpenAPISchema, mode: "read" | "write"): string {
            const example = this.example(schema, mode)

            switch (this.renderLanguage) {
                case "json": return JSON.stringify(example, null, 2)
                case "xml": return generateExampleXML(schema, mode)
                case "yaml": return jsYaml.dump(example, { indent: 2 })
            }

            return String(example)
        }
    }
})
</script>
