<template>
    <div>
        <Highlight :value="headersExample" lang="http"></Highlight>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { OpenAPIParameter, OpenAPIHeader } from "@/formats/openapi"
import Highlight from "@/components/Highlight.vue"

export default defineComponent({
    name: "OpenAPIRequestHeaders",
    components: { Highlight },
    props: {
        method: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: false
        },
        parameters: {
            type: Array as () => OpenAPIParameter[],
            required: false
        }
    },
    computed: {
        trueHeaders(): { [name: string]: OpenAPIHeader } {
            return Object.assign({}, ...(this.parameters || []).filter(p => p.in === "header").map(p => ({ [p.name]: p })))
        },
        headersExample(): string {
            const headerValues = Object.assign(
                {},
                this.contentType ? { "Accept": this.contentType } : {},
                ...Object.keys(this.trueHeaders).map(h => ({ [h]: this.trueHeaders[h].example }))
            )

            return [
                `${this.method.toUpperCase()} ${this.url} HTTP/1.1`,
                ...Object.keys(headerValues).map(h => `${h}: ${headerValues[h]}`)
            ].join("\n")
        }
    }
})
</script>
