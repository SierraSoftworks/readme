import Vue from "vue"
import Component from "vue-class-component"
import * as hljs from "highlight-js"

@Component({
    name: "highlight",
    template: `<pre class="hljs"><code v-html="compiledHtml"></code></pre>`,
    props: {
        value: String,
        lang: {
            type: String,
            required: false
        }
    }
})
export default class Highlight extends Vue {
    value!: string
    lang!: string

    get compiledHtml() {
        try {
            return hljs.highlight(this.lang, this.value).value
        } catch (err) {
            console.debug(`Unknown language '${this.lang}' used for highlighting`)
            return this.value
        }
    }
}