<template>
    <div>
        <Highlight :value="headersExample" lang="http"></Highlight>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { OpenAPIHeader } from "@/formats/openapi"
import Highlight from "@/components/Highlight.vue"

export default defineComponent({
    name: "OpenAPIResponseHeaders",
    components: { Highlight },
    props: {
        statusCode: {
            type: String,
            required: true
        },
        headers: {
            type: Object as () => { [name: string]: OpenAPIHeader },
            required: false
        },
        contentType: {
            type: String,
            required: false
        }
    },
    computed: {
        headersExample(): string {
            const headerValues = Object.assign(
                {},
                this.contentType ? { "Content-Type": this.contentType } : {},
                ...Object.keys(this.headers || {}).map(h => ({ [h]: this.headers![h].example }))
            )

            return [
                `${this.statusCode} Status Message HTTP/1.1`,
                ...Object.keys(headerValues).map(h => `${h}: ${headerValues[h]}`)
            ].join("\n")
        }
    }
})
</script>
