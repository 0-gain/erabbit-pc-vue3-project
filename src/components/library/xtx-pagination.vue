<template>
  <div class="xtx-pagination">
    <a
      href="javascript:;"
      :class="{ disabled: myCurrentPage === 1 }"
      @click="changePage(myCurrentPage - 1)"
      >上一页</a
    >
    <a href="javascript:;" v-if="page.start > 1">...</a>
    <a
      href="javascript"
      @click.prevent="changePage(i)"
      v-for="i in page.btnArr"
      :key="i"
      :class="{ active: i === myCurrentPage }"
      >{{ i }}</a
    >
    <a href="javascript" v-if="page.end < page.pageCounts">...</a>
    <a
      href="javascript:;"
      :class="{ disabled: myCurrentPage === page.pageCounts }"
      @click="changePage(myCurrentPage + 1)"
      >下一页</a
    >
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["current-change"]);
// 约定按钮的个数5个
const count = 5;
const myTotal = ref(100);
const myPageSize = ref(0);
const myCurrentPage = ref(1);
const page = computed(() => {
  // 总页数=总条数/每页的数目 向上取整
  const pageCounts = Math.ceil(myTotal.value / myPageSize.value);

  // 按钮个数和当前页码 ===>起始按钮、结束按钮、按钮数组
  //   1.理想情况下 当前页为3
  const offset = Math.floor(count / 2);
  let start = myCurrentPage.value - offset;
  let end = start + count - 1;
  // 2.如果起始页码小于1需要处理
  if (start < 1) {
    start = 1;
    end = start + count - 1 > pageCounts ? pageCounts : start + count - 1;
  }
  // 3. 如果结束页码大于总页数需要处理
  if (end > pageCounts) {
    end = pageCounts;
    start = end - count + 1 < 1 ? 1 : end - count + 1;
  }

  const btnArr = [];
  for (let i = start; i <= end; i++) {
    btnArr.push(i);
  }
  return {
    pageCounts,
    btnArr,
    start,
    end,
  };
});

// 切换当前页
const changePage = (i) => {
  myCurrentPage.value = i;
  emit("current-change", i);
};
watch(
  props,
  () => {
    myTotal.value = props.total;
    myPageSize.value = props.pageSize;
    myCurrentPage.value = props.currentPage;
  },
  { immediate: true }
);
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
