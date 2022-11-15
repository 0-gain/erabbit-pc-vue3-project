<template>
  <!-- 装载是内容 -->
  <div class="xtx-tabs-panel" v-show="activeName===name">
    <slot />
  </div>
</template>

<script setup>
import { inject } from 'vue';
const props = defineProps({
    // 标签页标题文章
    label:String,
    // 唯一标识
    name:String
})

// 当前组件该不该显示，取决于xtx-tabs组件的activeName数据是否和props.name一样
const activeName = inject('activeName')
</script>
<style scoped lang='less'>
</style>