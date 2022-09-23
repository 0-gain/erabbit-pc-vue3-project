<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem
      :key="categoryName.top.id"
      v-if="categoryName.top"
      :to="`/category/${categoryName.top.id}`"
      >{{ categoryName.top.name }}</XtxBreadItem
    >
    <Transition name="fade-right" mode="out-in">
        <XtxBreadItem v-if="categoryName.sub" :key="categoryName.sub.id">{{
          categoryName.sub?.name
        }}</XtxBreadItem>
      </Transition>
  </XtxBread>
</template>

<script setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";

const store = useStore();
const route = useRoute();

// 计算出一级分类和二级分类
const categoryName = computed(() => {
  const obj = { top: null };
  store.state.category.categoryList.forEach((top) => {
    top.children &&
      top.children.forEach((sub) => {
        if (sub.id === route.params.id) {
          // 设置二级类目
          obj.sub = { id: sub.id, name: sub.name };
          //   设置一级类目
          obj.top = { id: top.id, name: top.name };
        }
      });
  });
  return obj;
});
</script>
<style scoped lang="less"></style>
