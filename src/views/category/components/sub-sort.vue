<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:;"
        :class="{ active: sortData.sortField == null }"
        @click="changeSort(null)"
        >默认排序</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortData.sortField == 'publishTime' }"
        @click="changeSort('publishTime')"
        >最新商品</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortData.sortField == 'orderNum' }"
        @click="changeSort('orderNum')"
        >最高人气</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortData.sortField == 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序

        <i
          class="arrow up"
          :class="{
            active:
              sortData.sortField == 'price' && sortData.sortMethod == 'asc',
          }"
        />
        <i
          class="arrow down"
          :class="{
            active:
              sortData.sortField == 'price' && sortData.sortMethod == 'desc',
          }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change_check="changeCheck" v-model="sortData.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox  @change_check="changeCheck" v-model="sortData.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const emit = defineEmits(['sort-change'])
const sortData = reactive({
  // 是否有库存
  inventory: false,
  // 只显示特惠
  onlyDiscount: false,
  // 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum]
  sortField: null,
  // 排序规则，asc为正序，desc为倒序，默认为desc
  sortMethod: null,
});

// 更改排序
const changeSort = (sortField) => {
  sortData.sortField = sortField;
  if (sortField === "price") {
    // 第一次是降序
    if (sortData.sortMethod === null) {
      sortData.sortMethod = "desc";
    } else {
      sortData.sortMethod = sortData.sortMethod === "desc" ? "asc" : "desc";
    }
  } else {
    sortData.sortMethod = null;
  }
  emit('sort-change',sortData)
};

// 更改单选框
const changeCheck = ()=>{
  console.log('123');
  emit('sort-change',sortData)
}
</script>
<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
