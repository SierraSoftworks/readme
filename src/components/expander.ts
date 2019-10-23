import Vue from "vue"
import Component from "vue-class-component"
import * as template from "text!./expander.html"

@Component({
    name: "expander",
    template,
    props: {
        value: Boolean
    }
})
export default class Expander extends Vue {
    value!: boolean

    toggleState() {
        this.$emit("input", !this.value)
    }
}