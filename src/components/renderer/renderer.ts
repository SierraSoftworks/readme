import Vue from "vue"
import Component from "vue-class-component"
import { FileResponse } from "../../api/github"
import MarkdownRenderer from "./markdown"
import UnsupportedRenderer from "./unsupported"
import OpenAPIRenderer from "./openapi"

type RendererType = typeof Vue & {
    canRender(file: FileResponse): boolean;
}

const renderers: RendererType[] = [
    MarkdownRenderer,
    OpenAPIRenderer,
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
    file!: FileResponse

    get contentRenderer(): typeof Vue {
        if (!this.file) return null;
        return renderers.find(r => r.canRender(this.file))
    }
}