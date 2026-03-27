<template>
    <div>
        <Highlight :value="content" lang="json"></Highlight>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getFileContent, type GitHubFile } from "@/api/github"
import Highlight from "@/components/Highlight.vue"

const canRender = (file: GitHubFile): boolean => {
    return file.name.endsWith(".json")
}

export default defineComponent({
    name: "JsonRenderer",
    components: { Highlight },
    canRender,
    props: {
        file: {
            type: Object as () => GitHubFile,
            required: false
        }
    },
    computed: {
        content(): string {
            return this.file && getFileContent(this.file) || ""
        }
    }
})
</script>
