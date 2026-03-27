<template>
    <component :is="contentRenderer" :file="file"></component>
</template>

<script lang="ts">
import { defineComponent, type Component } from "vue"
import type { GitHubFile } from "@/api/github"
import MarkdownRenderer from "./MarkdownRenderer.vue"
import OpenAPIRenderer from "./OpenAPIRenderer.vue"
import JsonRenderer from "./JsonRenderer.vue"
import UnsupportedRenderer from "./UnsupportedRenderer.vue"

interface RendererComponent {
    component: Component
    canRender: (file: GitHubFile) => boolean
}

const renderers: RendererComponent[] = [
    { component: MarkdownRenderer, canRender: MarkdownRenderer.canRender },
    { component: OpenAPIRenderer, canRender: OpenAPIRenderer.canRender },
    { component: JsonRenderer, canRender: JsonRenderer.canRender },
    { component: UnsupportedRenderer, canRender: UnsupportedRenderer.canRender }
]

export default defineComponent({
    name: "Renderer",
    props: {
        file: {
            type: Object as () => GitHubFile | null,
            required: false,
            default: null
        }
    },
    computed: {
        contentRenderer(): Component | null {
            if (!this.file) return null
            const match = renderers.find(r => r.canRender(this.file!))
            return match ? match.component : null
        }
    }
})
</script>
