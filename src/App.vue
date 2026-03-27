<template>
    <el-container class="app">
        <el-header class="header" height="65px">
            <h2>
                <router-link :to="{ name: 'home' }" class="header__name">README</router-link>

                <span v-if="target">
                    <span class="header__separator">::</span>
                    <span class="header__service">{{ target.service }}</span>
                    <span class="header__separator">/</span>
                    <span class="header__owner">{{ target.owner }}</span>
                    <span class="header__separator">/</span>
                    <span class="header__repo">{{ target.repo }}</span>
                </span>
            </h2>
        </el-header>
        <el-main class="content" v-loading="loading">
            <router-view :key="$route.fullPath"></router-view>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ElNotification } from "element-plus"

export default defineComponent({
    name: "App",
    computed: {
        loading() {
            return this.$store.state.loading
        },
        target() {
            return this.$store.state.target
        },
        error() {
            return this.$store.state.requestError
        }
    },
    watch: {
        error(err) {
            if (!err) return
            ElNotification.error({
                title: "Woops!",
                message: err.message,
                duration: 0
            })
        }
    }
})
</script>

<style scoped>
.app {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.app > * {
    margin: 0;
    padding: 0;
}

.header {
    font-family: 'Montserrat';
    padding: 0 20px;
    border-bottom: 1px solid #f6f6f6;
}

.header__name {
    font-weight: 100;
    text-decoration: none;
    color: #000;
}

.header__separator {
    font-family: 'Fira Code';
    opacity: 0.3;
}

.header__service {
    font-weight: 100;
    text-transform: lowercase;
}

.header__owner {
    font-weight: 300;
    text-transform: lowercase;
}

.header__repo {
    text-transform: lowercase;
    font-weight: 400;
}

.content {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}
</style>
