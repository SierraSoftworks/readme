<template>
    <div>
        <div v-if="!doc">
            Could not parse the document
        </div>
        <div v-else>
            <el-row :gutter="80">
                <el-col :span="12">
                    <h1>
                        {{ doc.info.title }}

                        <el-tag v-if="doc.info.version">{{ doc.info.version }}</el-tag>

                        <el-tag v-if="doc.info.license" type="success">{{ doc.info.license.name }}</el-tag>
                    </h1>

                    <Markdown :value="doc.info.description || ''"></Markdown>

                    <h2>Endpoints</h2>
                    <div v-for="(path, url) in doc.paths" :key="key(String(url))">
                        <div :class="{ 'openapi-operation': true, active: selected && selected.url === url && selected.method === String(method) }"
                            v-for="(endpoint, method) in (path as any)" :key="key(endpoint.operationId || String(method))"
                            @click="selected = { url: String(url), method: String(method) }">

                            <span class="openapi-operation__name">{{ endpoint.summary }}</span>
                            <span class="openapi-operation__tags">
                                <el-tag v-for="tag in endpoint.tags" size="small" :key="key('tags', tag)">{{ tag }}
                                </el-tag>
                            </span>

                            <div class="openapi-operation__http">
                                <span class="openapi-operation__method">{{ String(method).toUpperCase() }}</span>
                                <span class="openapi-operation__url">{{ url }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span="12" v-if="endpoint">
                    <OpenAPIEndpoint :url="selected!.url" :method="selected!.method" :endpoint="(endpoint as any)">
                    </OpenAPIEndpoint>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import jsYaml from "js-yaml"
import { getFileContent, type GitHubFile } from "@/api/github"
import type { OpenAPIDoc, OpenAPIReference, OpenAPISchema, OpenAPIEndpoint as OpenAPIEndpointType } from "@/formats/openapi"
import { openAPIResolve, openAPIExample, OpenAPIVisitor } from "@/formats/openapi"
import Markdown from "@/components/Markdown.vue"
import Highlight from "@/components/Highlight.vue"
import OpenAPIEndpoint from "./openapi/OpenAPIEndpoint.vue"

class OpenAPIFlattener extends OpenAPIVisitor {
    constructor(private doc: OpenAPIDoc) {
        super()
    }

    protected visitReference<T>(ref: T | OpenAPIReference): T | OpenAPIReference {
        return openAPIResolve(this.doc, ref)
    }
}

const canRender = (file: GitHubFile): boolean => {
    if (![".yaml", ".yml"].some(name => file.name.toLowerCase().endsWith(name)))
        return false

    try {
        const doc = jsYaml.load(atob(file.content)) as OpenAPIDoc
        return ["3.0.0", "3.0.1", "3.0.2"].some(x => x == doc.openapi)
    } catch {
        return false
    }
}

export default defineComponent({
    name: "OpenAPIRenderer",
    components: { Markdown, Highlight, OpenAPIEndpoint },
    canRender,
    props: {
        file: {
            type: Object as () => GitHubFile,
            required: false
        }
    },
    data() {
        return {
            selected: null as { method: string; url: string } | null,
            doc: null as OpenAPIDoc | null
        }
    },
    computed: {
        endpoint(): OpenAPIEndpointType | null {
            if (!this.selected) return null
            if (!this.doc) return null
            return ((this.doc.paths || {})[this.selected.url] || {})[this.selected.method] || null
        }
    },
    watch: {
        file(f: GitHubFile) {
            this.loadDocument(f || this.file)
        }
    },
    mounted() {
        this.loadDocument(this.file!)
    },
    methods: {
        loadDocument(f: GitHubFile) {
            const text = f && getFileContent(f) || ""
            if (!text) {
                this.doc = null
            } else {
                const doc = jsYaml.load(text) as OpenAPIDoc
                const flattener = new OpenAPIFlattener(doc)
                this.doc = flattener.visit(doc)
            }
        },
        resolve<T>(ref: T | OpenAPIReference): T {
            return openAPIResolve(this.doc!, ref)
        },
        example(schema: OpenAPISchema | OpenAPIReference) {
            return openAPIExample(this.doc!, openAPIResolve(this.doc!, schema))
        },
        key(...parts: string[]): string {
            return parts.join("__")
        }
    }
})
</script>

<style scoped>
.openapi-operation {
    clear: both;
    border-left: 3px solid #888;
    padding: 15px 5px;
    cursor: pointer;
}

.openapi-operation.active {
    border-left: 3px solid #409EFF;
}

.openapi-operation__name {
    font-weight: 400;
    margin: 0 10px;
}

.openapi-operation__http {
    font-family: 'Fira Code', 'Courier New', Courier, monospace;
    margin: 0 10px;
}

.openapi-operation__method {
    font-weight: bold;
}

.openapi-operation__url {
    font-weight: 100;
}
</style>
