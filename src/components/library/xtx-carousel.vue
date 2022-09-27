<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, index) in sliders"
        :key="index"
        :class="{ fade: currentIndex === index }"
      >
        <RouterLink :to="item.hrefUrl" v-if="item.hrefUrl">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <div v-else class="slider">
          <RouterLink to="/" v-for="goods in item" :key="goods.id">
            <img :src="goods.picture" alt="" />
            <p>{{ goods.name }}</p>
            <p>&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, index) in sliders"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="currentIndex = index"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  // 轮播图的图片数据
  sliders: {
    type: Array,
    default: () => [],
  },
  // 轮播图定时器的秒数
  duration: {
    type: Number,
    default: 2000,
  },
  //是否开启定时器
  isAutoPlay: {
    type: Boolean,
    default: false,
  },
});

// 当前轮播图的索引
const currentIndex = ref(0);

// 自动播放的回调
let timer = null;
const autoPlayFn = function () {
  clearInterval(timer);
  timer = setInterval(() => {
    currentIndex.value++;
    if (currentIndex.value >= props.sliders.length) {
      currentIndex.value = 0;
    }
  }, props.duration);
};

// 自动播放：鼠标进入暂停，鼠标离开开始播放
const stop = () => {
  if (timer) clearInterval(timer);
};
const start = () => {
  if (props.sliders.length && props.isAutoPlay) {
    autoPlayFn();
  }
};

// 切换图片
const toggle = (step) => {
  const newValue = currentIndex.value + step;
  if (newValue >= props.sliders.length) {
    currentIndex.value = 0;
    return;
  }
  if (newValue < 0) {
    currentIndex.value = props.sliders.length - 1;
    return;
  }
  currentIndex.value = newValue;
};

// 侦听sliders
watch(
  () => props.sliders,
  (newValue) => {
    if (newValue.length && props.isAutoPlay) {
      currentIndex.value = 0;
      autoPlayFn();
    }
  },
  { immediate: true }
);

// 组件销毁，清除定时器
onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  .slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;
    > a {
      width: 240px;
      text-align: center;
      img {
        padding: 20px;
        width: 230px !important;
        height: 230px !important;
      }
      .name {
        font-size: 16px;
        color: #666;
        padding: 0 40px;
      }
      .price {
        font-size: 16px;
        color: @priceColor;
        margin-top: 15px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
