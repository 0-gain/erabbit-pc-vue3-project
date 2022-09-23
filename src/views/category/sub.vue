<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 过滤器 -->
      <SubFilter></SubFilter>

      <!-- 选项框 -->
      <XtxCheckbox></XtxCheckbox>
    </div>
  </div>
</template>

<script setup>
import SubBread from './components/sub-bread.vue';
import SubFilter from './components/sub-filter.vue';
</script>
<style scoped lang="less"></style>
