import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../markdown"
import * as template from "text!./request-headers.html"
import Highlight from "../../highlight";
import { OpenAPIParameter, OpenAPIEndpoint, OpenAPIHeader } from "../../../formats/openapi";

@Component({
    name: "openapi-request-headers",
    template,
    components: {
        markdown: Markdown,
        highlight: Highlight
    },
    props: {
        method: String,
        url: String,
        contentType: String,
        parameters: {
            type: Array,
            required: false
        }
    }
})
export default class OpenAPIRequestHeadersView extends Vue {
    method!: string
    url!: string
    parameters!: OpenAPIParameter[]
    contentType!: string

    get trueHeaders(): { [name: string]: OpenAPIHeader } {
        return Object.assign({}, ...(this.parameters || []).filter(p => p.in === "header").map(p => ({ [p.name]: p })))
    }

    get headersExample(): string {
        const headerValues = Object.assign(
            {},
            this.contentType ? { "Accept": this.contentType } : {},
            ...Object.keys(this.trueHeaders).map(h => ({ [h]: this.trueHeaders[h].example }))
        )

        return [
            `${this.method.toUpperCase()} ${this.url} HTTP/1.1`,
            ...Object.keys(headerValues).map(h => `${h}: ${headerValues[h]}`)
        ].join("\n")
    }
}