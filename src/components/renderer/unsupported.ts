import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./unsupported.html"
import { FileResponse } from "../../api/github"

@Component({
    name: "unsupported-renderer",
    template,
})
export default class UnsupportedRenderer extends Vue {
    static canRender(file: FileResponse): boolean {
        return true
    }
}