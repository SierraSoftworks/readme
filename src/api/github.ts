import * as helpers from "./helpers"
import { Target, TargetPath } from "./target"

export interface GitHubFile {
    type: "file"
    encoding: "base64"
    name: string
    path: string
    content: string
}

export interface GitHubDirectory {
    type: "dir"
    name: string
    path: string
}

export interface GitHubSymlink {
    type: "symlink"
    target: string
    name: string
    path: string
}

export interface GitHubSubmodule {
    type: "submodule"
    name: string
    path: string
    submodule_git_url: string
}

export type GitHubRepoEntry = GitHubFile | GitHubDirectory | GitHubSymlink | GitHubSubmodule

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    owner: {
        id: number;
        login: string;
    };
    private: boolean;
    description: string;
    fork: boolean;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    open_issues_count: number;
    is_template: boolean;
    topics: string[];
    homepage: string;
}

export interface GitHubBranch {
    name: string;
}

/**
 * Gets the list of repositories from the API.
 * @param owner The name of the owning entity
 */
export function getRepos(owner: string) {
    return fetch(helpers.buildUrl(getAPIBase(), "orgs", owner, "repos"))
        .then(res => helpers.apiHandleResponse<GitHubRepo[]>(res, true));
}

/**
 * Gets the list of branches for a repository.
 * @param repo The repository to fetch branches for.
 */
export function getBranches(repo: Target) {
    return fetch(helpers.buildUrl(getAPIBase(), "repos", repo.owner, repo.repo, "branches"))
        .then(res => helpers.apiHandleResponse<GitHubBranch[]>(res, true));
}

/**
 * Gets the README for a specific repository
 * @param repo The details of the repo to fetch the README for.
 */
export function getReadme(repo: Target) {
    return fetch(helpers.buildUrl(getAPIBase(), "/repos", repo.owner, repo.repo, "/readme"))
        .then(res => helpers.apiHandleResponse<GitHubFile>(res, true));
}

/**
 * Gets a file from a specific repository
 * @param path The details of where to fetch the file from.
 */
export function getFile(path: TargetPath) {
    return fetch(helpers.buildUrl(getAPIBase(), "/repos", path.owner, path.repo, "/contents", path.path))
        .then(res => helpers.apiHandleResponse<GitHubFile>(res, true));
}

/**
 * Gets the contents of a specific path within the repository
 * @param path The path to retrieve content from
 */
export function getRepoContents(path: TargetPath) {
    return fetch(helpers.buildUrl(getAPIBase(), "/repos", path.owner, path.repo, "/contents", path.path))
        .then(res => helpers.apiHandleResponse<GitHubRepoEntry | GitHubRepoEntry[]>(res, true));
}

function getAPIBase() {
    return "https://api.github.com"
}