<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  to: {
    type: [String, Object],
  },
});
</script>
<style scoped lang="less"></style>
