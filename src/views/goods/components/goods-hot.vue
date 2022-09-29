<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <div v-if="goodsHotData">
      <GoodsItem
        v-for="item in goodsHotData"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { reqGoodsHot } from "@/api/product";
import GoodsItem from "@/views/category/components/goods-item.vue";
const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  id: String,
  limit: {
    type: Number,
    default: 3,
  },
});

const titleObj = { 1: "24小时热销榜", 2: "周热销榜", 3: "总热销榜" };
// 计算title的值
const title = computed(() => {
  return titleObj[props.type];
});
// 获取热销数据
const goodsHotData = ref([]);
const { id, type, limit } = props;
reqGoodsHot(id, type, limit).then(({ result }) => {
  goodsHotData.value = result;
});
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
