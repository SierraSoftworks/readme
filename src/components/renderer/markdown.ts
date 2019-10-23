import Vue from "vue"
import Component from "vue-class-component"
import { FileResponse } from "../../api/github"
import Markdown from "../markdown"

@Component({
    name: "markdown-renderer",
    template: `<markdown :value="content"></markdown>`,
    components: {
        markdown: Markdown
    },
    props: {
        file: {
            type: Object,
            required: false
        }
    }
})
export default class MarkdownRenderer extends Vue {
    file!: FileResponse

    get content() {
        return this.file && atob(this.file.content) || ""
    }

    static canRender(file: FileResponse): boolean {
        return [".md", ".markdown", "readme"].some(name => file.name.toLowerCase().endsWith(name));
    }
}