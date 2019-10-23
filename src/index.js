require.config({
    paths: {
        // "vue-module": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10",
        // "vue-router-module": "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3",
        // "vuex": "https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1",
        "vue-class-component": "https://cdn.jsdelivr.net/npm/vue-class-component@7.1.0/dist/vue-class-component.min",
        // "ELEMENT": "https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.12.0/index",

        // "dayjs": "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.16",
        "highlight-js": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min",
        "js-yaml": "https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.13.1/js-yaml.min",
        "markdown-it": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/9.1.0/markdown-it.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
    },
    map: {
        "*": {

        }
    },
    packages: [
        {
            name: "vue-module",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10",
            main: "vue"
        },
        {
            name: "vue-router-module",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3",
            main: "vue-router"
        },
        {
            name: "vuex",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1",
            main: "vuex"
        },
        {
            name: "dayjs",
            location: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.16",
            main: "dayjs.min"
        },
        {
            name: "ELEMENT",
            location: "https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.12.0",
            main: "index"
        }
    ],
    shim: {
        "ELEMENT": {
            deps: ["vue"]
        }
    },
    deps: [
        "vue-module",
        "vue-router-module",
        "vuex"
    ],
    callback: () => {
        requirejs(["vue", "ELEMENT", "ELEMENT/locale/en"], (Vue, ElementUI, locale) => {
            Vue.use(ElementUI, { locale })

            requirejs(["app"], function (app) { })
        })
    }
})

define("vue", ["vue-module"], (Vue) => {
    Vue.default = Vue
    return Vue
})

define("vue-router", ["vue-router-module"], (VueRouter) => {
    VueRouter.default = VueRouter
    return VueRouter
})
