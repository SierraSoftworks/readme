<template>
    <el-container>
        <el-aside width="100px">
            <el-menu class="sidebar-menu" :collapse="true">
                <el-menu-item @click="setPath(null)">
                    <el-icon><House /></el-icon>
                    <template #title>Home</template>
                </el-menu-item>

                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><Document /></el-icon>
                        <span>Browse</span>
                    </template>

                    <el-menu-item-group>
                        <template #title>Files</template>
                        <el-menu-item v-for="file in files" @click="setPath(file.path)" :key="file.path">{{ file.name }}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>

                <el-sub-menu index="2" v-if="branches.length > 1">
                    <template #title>
                        <el-icon><Guide /></el-icon>
                        <span>Branches</span>
                    </template>

                    <el-menu-item-group>
                        <template #title>Branches</template>
                        <el-menu-item v-for="b in branches" :key="b.name">{{ b.name }}</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-main>
            <Renderer :file="file"></Renderer>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { House, Document, Guide } from "@element-plus/icons-vue"
import { getReadme } from "@/api"
import { getFile, getBranches, getRepoContents, type GitHubFile, type GitHubBranch, type GitHubRepoEntry } from "@/api/github"
import { MUT_LOADING, MUT_REQUEST_ERROR, MUT_SET_TARGET } from "@/store"
import type { Target } from "@/api/target"
import { isTargetPath } from "@/api/target"
import Renderer from "@/components/renderer/Renderer.vue"

export default defineComponent({
    name: "GitHubView",
    components: {
        Renderer,
        House,
        Document,
        Guide
    },
    props: {
        owner: {
            type: String,
            required: true
        },
        repo: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: false
        },
        branch: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            file: null as GitHubFile | null,
            files: [] as GitHubRepoEntry[],
            branches: [] as GitHubBranch[]
        }
    },
    computed: {
        target(): Target | null {
            return this.$store.state.target
        }
    },
    watch: {
        owner() {
            this.updateTarget()
            this.updateBranches()
            this.updateFiles()
        },
        repo() {
            this.updateTarget()
            this.updateBranches()
            this.updateFiles()
        },
        path() {
            this.updateTarget()
        },
        branch() {
            this.updateTarget()
        },
        target() {
            this.updateFile()
        }
    },
    mounted() {
        this.updateTarget()
        this.updateBranches()
        this.updateFile()
        this.updateFiles()
    },
    methods: {
        getSelectedFile() {
            if (!this.target) {
                this.file = null
                return
            }
            if (!isTargetPath(this.target)) return getReadme(this.target)
            return getFile(this.target)
        },
        updateBranches() {
            if (!this.target) return
            return getBranches(this.target).then(branches => this.branches = branches)
        },
        updateFiles() {
            if (!this.target) return
            return getRepoContents(Object.assign({}, this.target, { path: "/" })).then(content => {
                if (Array.isArray(content))
                    this.files = content
                else
                    this.files = [content]
            })
        },
        updateTarget() {
            this.$store.commit(MUT_SET_TARGET, {
                service: "github.com",
                owner: this.owner,
                repo: this.repo,
                path: this.path || null,
                branch: this.branch || null,
            } as Target)
        },
        updateFile() {
            this.$store.commit(MUT_LOADING, true)
            const result = this.getSelectedFile()
            if (result && typeof result.then === "function") {
                return result.then(file => this.file = file).catch(err => {
                    this.$store.commit(MUT_REQUEST_ERROR, err)
                }).then(() => this.$store.commit(MUT_LOADING, false))
            }
            this.$store.commit(MUT_LOADING, false)
        },
        setPath(path: string | null) {
            this.$router.push({
                name: this.$route.name!,
                params: {
                    owner: this.owner,
                    repo: this.repo,
                    path: path || ""
                },
                query: {
                    branch: this.branch || ""
                }
            })
        }
    }
})
</script>

<style scoped>
.sidebar-menu {
    position: fixed;
    left: 0;
    top: var(--header-height, 65px);
    bottom: 0;
}
</style>
