import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../markdown"
import * as template from "text!./response-headers.html"
import Highlight from "../../highlight";
import { OpenAPIParameter, OpenAPIEndpoint, OpenAPIHeader } from "../../../formats/openapi";

@Component({
    name: "openapi-headers",
    template,
    components: {
        markdown: Markdown,
        highlight: Highlight
    },
    props: {
        statusCode: String,
        headers: {
            type: Object,
            required: false
        },
        contentType: {
            type: String,
            required: false
        }
    }
})
export default class OpenAPIResponseHeadersView extends Vue {
    statusCode!: string
    headers!: { [name: string]: OpenAPIHeader }
    contentType!: string

    get headersExample(): string {
        const headerValues = Object.assign(
            {},
            this.contentType ? { "Content-Type": this.contentType } : {},
            ...Object.keys(this.headers || {}).map(h => ({ [h]: this.headers[h].example }))
        )

        return [
            `${this.statusCode} Status Message HTTP/1.1`,
            ...Object.keys(headerValues).map(h => `${h}: ${headerValues[h]}`)
        ].join("\n")
    }
}