<template>
    <el-container>
        <el-main style="text-align: center;">
            <h1>README</h1>
            <p>Beautiful documentation straight from GitHub</p>

            <el-divider>Repositories</el-divider>

            <el-carousel class="repo-showcase" height="100px" indicator-position="outside">
                <el-carousel-item v-for="repo in repos" :key="repo.id">
                    <h3 class="clearfix">
                        <router-link :to="{ name: 'github-repo', params: { owner: repo.owner.login, repo: repo.name } }">
                            {{ repo.name }}</router-link>
                    </h3>

                    <p>{{ repo.description }}</p>
                </el-carousel-item>
            </el-carousel>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getRepos, type GitHubRepo } from "@/api/github"
import { MUT_SET_TARGET } from "@/store"

export default defineComponent({
    name: "HomeView",
    data() {
        return {
            repos: [] as GitHubRepo[]
        }
    },
    mounted() {
        getRepos("sierrasoftworks").then(repos => this.repos = repos)
        this.$store.commit(MUT_SET_TARGET, null)
    }
})
</script>

<style scoped>
.repo-showcase :deep(.el-carousel__item) {
    text-align: center;
}
</style>
