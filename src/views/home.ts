import Vue from "vue"
import Component from "vue-class-component"
import { RawLocation } from "vue-router"
import { router } from "../router"

import * as template from "text!./home.html"
import { GitHubRepo, getRepos } from "../api/github"
import { store, MUT_SET_TARGET } from "../store"
@Component({
    template
})
export default class HomeView extends Vue {
    repos: GitHubRepo[] = []

    mounted() {
        getRepos("sierrasoftworks").then(repos => this.repos = repos)

        store.commit(MUT_SET_TARGET, null)
    }

    navigate(name: string, opts?: RawLocation) {
        if (~name.indexOf("://")) return window.open(name, "_blank")
        router.push(Object.assign({
            name
        }, opts))
    }
}