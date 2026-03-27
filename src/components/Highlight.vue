<template>
    <pre class="hljs"><code v-html="compiledHtml"></code></pre>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import hljs from "highlight.js"

export default defineComponent({
    name: "Highlight",
    props: {
        value: {
            type: String,
            required: true
        },
        lang: {
            type: String,
            required: false
        }
    },
    computed: {
        compiledHtml(): string {
            try {
                if (this.lang) {
                    return hljs.highlight(this.value, { language: this.lang }).value
                }
                return hljs.highlightAuto(this.value).value
            } catch (err) {
                console.debug(`Unknown language '${this.lang}' used for highlighting`)
                return this.value
            }
        }
    }
})
</script>
