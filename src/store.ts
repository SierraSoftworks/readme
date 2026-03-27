import { createStore } from "vuex"
import { Target } from "./api/target"

export const MUT_SET_API = "set-api"
export const MUT_REQUEST_ERROR = "set-request-error"
export const MUT_LOADING = "set-loading"
export const MUT_SET_TARGET = "set-target"

interface StoreData {
    api: string
    loading: boolean
    requestError: Error | null
    target: Target | null
}

export const store = createStore<StoreData>({
    state: {
        api: localStorage.getItem("api:url") || window.location.origin,
        requestError: null,
        loading: false,
        target: null
    },
    mutations: {
        [MUT_SET_API](state, url: string) {
            state.api = url
            localStorage.setItem("api:url", url)
        },
        [MUT_REQUEST_ERROR](state, error: Error) {
            state.requestError = error
        },
        [MUT_LOADING](state, loading: boolean) {
            state.loading = loading
        },
        [MUT_SET_TARGET](state, target: Target) {
            state.target = target
        }
    },
    actions: {},
    getters: {}
})