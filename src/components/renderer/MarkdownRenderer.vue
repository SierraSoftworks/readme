<template>
    <Markdown :value="content"></Markdown>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { GitHubFile } from "@/api/github"
import Markdown from "@/components/Markdown.vue"

const canRender = (file: GitHubFile): boolean => {
    return [".md", ".markdown", "readme"].some(name => file.name.toLowerCase().endsWith(name))
}

export default defineComponent({
    name: "MarkdownRenderer",
    components: { Markdown },
    canRender,
    props: {
        file: {
            type: Object as () => GitHubFile,
            required: false
        }
    },
    computed: {
        content(): string {
            return this.file && atob(this.file.content) || ""
        }
    }
})
</script>
