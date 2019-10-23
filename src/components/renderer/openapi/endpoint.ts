import Vue from "vue"
import Component from "vue-class-component"
import Markdown from "../../markdown"
import * as template from "text!./endpoint.html"
import Highlight from "../../highlight";
import { OpenAPIEndpoint, OpenAPIResponse } from "../../../formats/openapi";
import OpenAPIMediaTypesView from "./mediatypes";
import OpenAPIResponseHeadersView from "./response-headers";
import OpenAPIRequestHeadersView from "./request-headers";
import Expander from "../../expander";

@Component({
    name: "openapi-endpoint",
    template,
    components: {
        markdown: Markdown,
        highlight: Highlight,
        "openapi-mediatypes": OpenAPIMediaTypesView,
        "openapi-request-headers": OpenAPIRequestHeadersView,
        "openapi-response-headers": OpenAPIResponseHeadersView,
        expander: Expander
    },
    props: {
        endpoint: {
            type: Object,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    watch: {
        responseCodes() {
            this.selectedResponseCode = this.responseCodes[0] || "200"
        },
        contentTypes() {
            this.selectedContentType = this.contentTypes[0] || ""
        }
    }
})
export default class OpenAPIEndpointView extends Vue {
    endpoint!: OpenAPIEndpoint
    method!: string
    url!: string

    expanded: boolean = false

    selectedResponseCode = "200"
    selectedContentType = "collapse"

    key(...parts: string[]): string {
        return [this.endpoint.operationId, ...parts].join("__")
    }

    get contentTypes(): string[] {
        var set = new Set([].concat(...Object.keys(this.endpoint.responses).filter(k => k !== "default").map(t => this.endpoint.responses[t]).map((r: OpenAPIResponse) => Object.keys(r.content || {}))))
        return [...set]
    }

    get responseCodes(): string[] {
        return Object.keys(this.endpoint.responses).filter(k => k !== "default")
    }
}