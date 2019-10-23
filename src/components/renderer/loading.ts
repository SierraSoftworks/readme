import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./loading.html"

@Component({
    name: "loading-renderer",
    template,
})
export default class LoadingRenderer extends Vue {
}