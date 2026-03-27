<template>
    <span v-html="compiledHtml"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"

const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: (src: string, lang: string) => {
        if (!lang) return src

        try {
            return hljs.highlight(src, { language: lang }).value
        } catch (err) {
            console.debug(`Unknown language '${lang}' used in Markdown`)
            return src
        }
    }
})

export default defineComponent({
    name: "Markdown",
    props: {
        value: {
            type: String,
            required: true
        },
        inline: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        compiledHtml(): string {
            if (this.inline) return md.renderInline(this.value || "")
            return md.render(this.value || "")
        }
    }
})
</script>
