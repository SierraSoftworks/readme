<template>
    <div class="openapi-endpoint" :key="key()">
        <div class="openapi-endpoint__header clearfix">
            <h3>
                {{ endpoint.summary }}
                <el-tag v-for="tag in endpoint.tags" :key="key('tags', tag)">{{ tag }}
                </el-tag>

                <span style="float: right;">
                    <strong>{{ method.toUpperCase() }}</strong>
                    {{ url }}
                </span>
            </h3>

            <Markdown :value="endpoint.description || ''"></Markdown>
        </div>

        <div class="openapi-endpoint__content">
            <el-tabs v-model="selectedContentType">
                <el-tab-pane v-for="contentType in contentTypes" :key="contentType" :label="contentType"
                    :name="contentType">
                </el-tab-pane>
            </el-tabs>

            <el-row :gutter="40">
                <el-col :span="12">
                    <h4>Request</h4>
                    <OpenAPIRequestHeaders :url="url" :method="method" :parameters="(endpoint.parameters as any)"
                        :contentType="endpoint.requestBody && (endpoint.requestBody as any).content && selectedContentType || null">
                    </OpenAPIRequestHeaders>

                    <div v-if="endpoint.requestBody && (endpoint.requestBody as any).content">
                        <OpenAPIMediaTypes :content="(endpoint.requestBody as any).content" :contentType="selectedContentType"
                            mode="write">
                        </OpenAPIMediaTypes>
                    </div>
                </el-col>
                <el-col :span="12">
                    <h4>Responses</h4>
                    <el-collapse v-model="selectedResponseCode" accordion>
                        <el-collapse-item :title="String(statusCode)" :name="String(statusCode)"
                            v-for="(response, statusCode) in (endpoint.responses as any)"
                            :key="key(endpoint.operationId || '', 'responses', String(statusCode))">
                            <template #title>
                                <h5>
                                    HTTP {{ statusCode }}
                                    <span v-if="response.description">- <Markdown :inline="true"
                                            :value="response.description">
                                        </Markdown></span>
                                </h5>
                            </template>

                            <h5>Example</h5>
                            <OpenAPIResponseHeaders :statusCode="String(statusCode)" :headers="response.headers"
                                :contentType="response.content && selectedContentType || null">
                            </OpenAPIResponseHeaders>

                            <OpenAPIMediaTypes v-if="response.content" :content="response.content"
                                :contentType="selectedContentType" mode="read">
                            </OpenAPIMediaTypes>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { OpenAPIEndpoint, OpenAPIResponse } from "@/formats/openapi"
import Markdown from "@/components/Markdown.vue"
import Highlight from "@/components/Highlight.vue"
import Expander from "@/components/Expander.vue"
import OpenAPIMediaTypes from "./OpenAPIMediaTypes.vue"
import OpenAPIRequestHeaders from "./OpenAPIRequestHeaders.vue"
import OpenAPIResponseHeaders from "./OpenAPIResponseHeaders.vue"

export default defineComponent({
    name: "OpenAPIEndpoint",
    components: {
        Markdown,
        Highlight,
        Expander,
        OpenAPIMediaTypes,
        OpenAPIRequestHeaders,
        OpenAPIResponseHeaders
    },
    props: {
        endpoint: {
            type: Object as () => OpenAPIEndpoint,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            expanded: false,
            selectedResponseCode: "200",
            selectedContentType: "collapse"
        }
    },
    computed: {
        contentTypes(): string[] {
            const set = new Set<string>(
                ([] as string[]).concat(
                    ...Object.keys(this.endpoint.responses)
                        .filter(k => k !== "default")
                        .map(t => this.endpoint.responses[t])
                        .map((r: OpenAPIResponse) => Object.keys(r.content || {}))
                )
            )
            return [...set]
        },
        responseCodes(): string[] {
            return Object.keys(this.endpoint.responses).filter(k => k !== "default")
        }
    },
    watch: {
        responseCodes() {
            this.selectedResponseCode = this.responseCodes[0] || "200"
        },
        contentTypes() {
            this.selectedContentType = this.contentTypes[0] || ""
        }
    },
    methods: {
        key(...parts: string[]): string {
            return [this.endpoint.operationId, ...parts].join("__")
        }
    }
})
</script>

<style scoped>
.openapi-endpoint {
    margin-bottom: 50px;
    border-radius: 5px;
    border: 1px solid #f6f6f6;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
}

.openapi-endpoint__header {
    padding: 20px;
    border-bottom: 1px solid #f6f6f6;
}

.openapi-endpoint__content {
    padding: 20px;
    background: #f6f6f6;
}

.openapi-endpoint__content :deep(.el-collapse-item__header),
.openapi-endpoint__content :deep(.el-collapse-item__content),
.openapi-endpoint__content :deep(.el-collapse-item__wrap) {
    background: #f6f6f6;
}
</style>
