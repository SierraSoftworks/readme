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

        error() {
            return store.state.requestError
        }
    },
    watch: {
        error(err) {
            if (!err) return
            this.$notify.error({
                title: `${err.code || 500} ${err.name || 'Server Error'}`,
                message: err.message || err,
                duration: 0
            })
        }
    },
    methods: {

    }
})
