import Vue from "vue"
import Component from "vue-class-component"
import { GitHubFile } from "../../api/github"
import Markdown from "../markdown"
import * as yaml from "js-yaml";
import { OpenAPIDoc, OpenAPIReference, openAPIResolve, OpenAPISchema, openAPIExample, OpenAPIVisitor, OpenAPIEndpoint, OpenAPIRequestBody } from "../../formats/openapi";
import * as template from "text!./openapi.html"
import Highlight from "../highlight";
import OpenAPIEndpointView from "./openapi/endpoint";

@Component({
    name: "openapi-renderer",
    template,
    components: {
        markdown: Markdown,
        highlight: Highlight,
        "openapi-endpoint": OpenAPIEndpointView
    },
    props: {
        file: {
            type: Object,
            required: false
        }
    },
    watch: {
        file(f) {
            this.loadDocument(f || this.file)
        }
    }
})
export default class OpenAPIRenderer extends Vue {
    file!: GitHubFile

    selected: {
        method: string
        url: string
    } = null

    get endpoint(): OpenAPIEndpoint {
        if (!this.selected) return null
        if (!this.doc) return null
        return ((this.doc.paths || {})[this.selected.url] || {})[this.selected.method] || null
    }

    doc: OpenAPIDoc = null

    mounted() {
        this.loadDocument(this.file)
    }

    loadDocument(f: GitHubFile) {
        const text = f && atob(f.content) || ""
        if (!text) this.doc = null;
        else {
            const doc = yaml.safeLoad(text);
            const flattener = new OpenAPIFlattener(doc)
            this.doc = flattener.visit(doc)
        }
    }

    resolve<T>(ref: T | OpenAPIReference): T {
        return openAPIResolve(this.doc, ref)
    }

    example(schema: OpenAPISchema | OpenAPIReference) {
        return openAPIExample(this.doc, openAPIResolve(this.doc, schema))
    }

    key(...parts: string[]): string {
        return parts.join("__")
    }

    static canRender(file: GitHubFile): boolean {
        if (![".yaml", ".yml"].some(name => file.name.toLowerCase().endsWith(name)))
            return false;

        const doc: OpenAPIDoc = yaml.safeLoad(atob(file.content))
        return ["3.0.0", "3.0.1", "3.0.2"].some(x => x == doc.openapi)
    }
}

class OpenAPIFlattener extends OpenAPIVisitor {
    constructor(private doc: OpenAPIDoc) {
        super()
    }

    protected visitReference<T>(ref: T | OpenAPIReference): T | OpenAPIReference {
        return openAPIResolve(this.doc, ref)
    }
}