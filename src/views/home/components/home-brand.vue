<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        href="javascript:;"
        @click="toggle(-1)"
        :class="{ disabled: currentIndex === 0 }"
        class="iconfont icon-angle-left prev"
      ></a>
      <a
        @click="toggle(1)"
        href="javascript:;"
        :class="{ disabled: currentIndex === 1 }"
        class="iconfont icon-angle-right next"
      ></a>
    </template>
    <div class="box" ref="target">
      <Transition>
        <ul
          v-if="brands.length"
          class="list"
          :style="{ transform: `translateX(${-currentIndex * 1250}px)`}"
        >
          <li v-for="(item, index) in brands" :key="index">
            <RouterLink to="/">
              <img v-lazyLoad="item.logo" alt="" />
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else />
      </Transition>
    </div>
  </HomePanel>
</template>

<script setup>
import HomePanel from "./home-panel.vue";
import HomeSkeleton from "./home-skeleton.vue";
import { useLazyData } from "@/hooks";
import { ref } from "vue";
// 引入接口
import { reqHome_brand } from "@/api/home";

// 当前渲染的索引
const currentIndex = ref(0);

// 切换图片盒子的回调
const toggle = function (step) {
  const newValue = currentIndex.value + step;
  if (newValue < 0 || newValue > 1) {
    return;
  }
  currentIndex.value = newValue;
};

// 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数再函数中调用API
const { target, result: brands } = useLazyData(() => reqHome_brand(10));
</script>
<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
