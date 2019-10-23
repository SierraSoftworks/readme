import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./readme.html"
import { getReadme } from "../api"
import { FileResponse, getFile } from "../api/github"
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
        }
    },
    watch: {
        owner() {
            this.updateTarget()
        },
        repo() {
            this.updateTarget()
        },
        path() {
            this.updateTarget()
        },
        target() {
            this.updateFile()
        }
    }
})
export default class ReadmeView extends Vue {
    private service: string = "github.com"
    private owner!: string
    private repo!: string
    private path!: string

    file: FileResponse = null

    mounted() {
        this.updateTarget()
        this.updateFile()
    }

    get target(): Target {
        return store.state.target
    }

    getSelectedFile() {
        if (!this.target) return this.file = null;
        if (!isTargetPath(this.target)) return getReadme(this.target)

        return getFile(this.target)
    }

    updateTarget() {
        store.commit(MUT_SET_TARGET, <Target>{
            service: this.service,
            owner: this.owner,
            repo: this.repo,
            path: this.path,
        })
    }

    updateFile() {
        store.commit(MUT_LOADING, true)
        return this.getSelectedFile().then(file => this.file = file).catch(err => {
            store.commit(MUT_REQUEST_ERROR, err)
        }).then(() => store.commit(MUT_LOADING, false));
    }
}