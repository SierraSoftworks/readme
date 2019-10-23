import Vue from "vue"

const base64encode = Vue.filter("base64encode", value => btoa(value))
const base64decode = Vue.filter("base64decode", value => atob(value))
export {
    base64encode,
    base64decode
}