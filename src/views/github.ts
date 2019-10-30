import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./github.html"
import { getReadme } from "../api"
import { GitHubFile, getFile, GitHubBranch, getBranches, GitHubRepoEntry, getRepoContents } from "../api/github"
import { store, MUT_LOADING, MUT_REQUEST_ERROR, MUT_SET_TARGET } from "../store"
import Renderer from "../components/renderer/renderer"
import { Target, isTargetPath } from "../api/target"

@Component({
    template,
    components: {
        renderer: Renderer
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
    }
})
export default class GitHubView extends Vue {
    private owner!: string
    private repo!: string
    private path!: string
    private branch!: string

    file: GitHubFile = null
    files: GitHubRepoEntry[] = []
    branches: GitHubBranch[] = []

    mounted() {
        this.updateTarget()
        this.updateBranches()
        this.updateFile()
        this.updateFiles()
    }

    get target(): Target {
        return store.state.target
    }

    getSelectedFile() {
        if (!this.target) return this.file = null;
        if (!isTargetPath(this.target)) return getReadme(this.target)

        return getFile(this.target)
    }

    updateBranches() {
        return getBranches(this.target).then(branches => this.branches = branches)
    }

    updateFiles() {
        return getRepoContents(Object.assign({}, this.target, { path: "/" })).then(content => {
            if (Array.isArray(content))
                this.files = content
            else
                this.files = [content]
        })
    }

    updateTarget() {
        store.commit(MUT_SET_TARGET, <Target>{
            service: "github.com",
            owner: this.owner,
            repo: this.repo,
            path: this.path || null,
            branch: this.branch || null,
        })
    }

    updateFile() {
        store.commit(MUT_LOADING, true)
        return this.getSelectedFile().then(file => this.file = file).catch(err => {
            store.commit(MUT_REQUEST_ERROR, err)
        }).then(() => store.commit(MUT_LOADING, false));
    }

    setPath(path: string) {
        this.$router.push({
            name: this.$route.name,
            params: {
                owner: this.owner,
                repo: this.repo,
                path
            },
            query: {
                branch: this.branch
            }
        })
    }
}