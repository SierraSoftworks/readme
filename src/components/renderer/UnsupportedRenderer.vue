<template>
    <div>
        <pre>{{ content }}</pre>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { GitHubFile } from "@/api/github"

const canRender = (file: GitHubFile): boolean => {
    return true
}

export default defineComponent({
    name: "UnsupportedRenderer",
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
