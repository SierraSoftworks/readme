import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./json.html"
import { GitHubFile } from "../../api/github"
import Highlight from "../highlight"

@Component({
    name: "json-renderer",
    template,
    components: {
        highlight: Highlight
    },
    props: {
        file: {
            type: Object,
            required: false
        }
    }
})
export default class JsonRenderer extends Vue {
    file!: GitHubFile

    get content() {
        return this.file && atob(this.file.content) || ""
    }

    static canRender(file: GitHubFile): boolean {
        return file.name.endsWith(".json")
    }
}