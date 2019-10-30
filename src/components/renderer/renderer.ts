import Vue from "vue"
import Component from "vue-class-component"
import { GitHubFile } from "../../api/github"
import MarkdownRenderer from "./markdown"
import UnsupportedRenderer from "./unsupported"
import OpenAPIRenderer from "./openapi"
import JsonRenderer from "./json"

type RendererType = typeof Vue & {
    canRender(file: GitHubFile): boolean;
}

const renderers: RendererType[] = [
    MarkdownRenderer,
    OpenAPIRenderer,
    JsonRenderer,
    UnsupportedRenderer
]

@Component({
    name: "renderer",
    template: `<component :is="contentRenderer" :file="file"></component>`,
    props: {
        file: {
            type: Object,
            required: false,
            default: null
        }
    }
})
export default class Renderer extends Vue {
    file!: GitHubFile

    get contentRenderer(): typeof Vue {
        if (!this.file) return null;
        return renderers.find(r => r.canRender(this.file))
    }
}