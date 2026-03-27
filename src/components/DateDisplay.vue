<template>
    <time :datetime="value">{{ formatted }}</time>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export default defineComponent({
    name: "DateDisplay",
    props: {
        value: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: false,
            default: "YYYY-MM-DD HH:mm:ss"
        }
    },
    computed: {
        formatted(): string {
            return dayjs.utc(this.value).local().format(this.format)
        }
    }
})
</script>
