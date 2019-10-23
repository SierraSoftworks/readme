import { store } from "../store";
import * as helpers from "./helpers";
import { Target, TargetPath } from "./target";

export interface FileResponse {
    type: "file"
    encoding: "base64"
    name: string
    path: string
    content: string
}

/**
 * Gets the README for a specific repository
 * @param repo The details of the repo to fetch the README for.
 */
export function getReadme(repo: Target) {
    return fetch(helpers.buildUrl(getAPIBase(), "/repos", repo.owner, repo.repo, "/readme"))
        .then(res => helpers.apiHandleResponse<FileResponse>(res, true));
}

/**
 * Gets a file from a specific repository
 * @param path The details of where to fetch the file from.
 */
export function getFile(path: TargetPath) {
    return fetch(helpers.buildUrl(getAPIBase(), "/repos", path.owner, path.repo, "/contents", path.path))
        .then(res => helpers.apiHandleResponse<FileResponse>(res, true));
}

function getAPIBase() {
    return "https://api.github.com"
}