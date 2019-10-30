import Vue from "vue";

import "./components/index";
import "./filters/index";
import "./views/index";

import { store } from "./store";
import { router } from "./router";

export const app = new Vue({
    el: "#app",
    data: {

    },
    store,
    router,
    computed: {
        loading() {
            return store.state.loading
        },
        api() {
            return store.state.api
        },
        target() {
            return store.state.target
        },

        error() {
            return store.state.requestError
        }
    },
    watch: {
        error(err) {
            if (!err) return
            this.$notify.error({
                title: `Woops!`,
                message: err.message,
                duration: 0
            })
        }
    },
    methods: {

    }
})
