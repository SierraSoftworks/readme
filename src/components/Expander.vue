<template>
    <div class="expander">
        <div :class="{ 'expander-content': true, 'expander-content__expanded': modelValue }">
            <slot></slot>
        </div>

        <div class="expander-control" @click="toggleState()">
            <el-icon v-if="!modelValue"><ArrowDown /></el-icon>
            <el-icon v-else><ArrowUp /></el-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue"

export default defineComponent({
    name: "Expander",
    components: { ArrowDown, ArrowUp },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:modelValue"],
    methods: {
        toggleState() {
            this.$emit("update:modelValue", !this.modelValue)
        }
    }
})
</script>

<style scoped>
.expander-content {
    height: 0;
    overflow: hidden;
    transition: height 0.25s ease;
}

.expander-content__expanded {
    height: 100%;
}

.expander-control {
    padding: 10px;
    text-align: center;
    border-top: 1px solid #f6f6f6;
    color: #888;
    cursor: pointer;
}

.expander-control:hover {
    background: #eee;
}
</style>
