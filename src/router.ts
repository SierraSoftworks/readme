import { createRouter, createWebHistory, RouteLocationNormalized } from "vue-router"

function props(route: RouteLocationNormalized) {
    return Object.assign({}, route.query, route.params)
}

const routes = [
    {
        name: "home",
        path: "/",
        component: () => import("./views/HomeView.vue")
    },
    {
        name: "github-repo",
        path: "/github.com/:owner/:repo/:path*",
        component: () => import("./views/GitHubView.vue"),
        props
    }
]

export const router = createRouter({
    routes,
    history: createWebHistory(),
    linkActiveClass: "active"
})