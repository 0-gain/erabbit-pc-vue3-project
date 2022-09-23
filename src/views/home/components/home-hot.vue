<template>
  <HomePanel ref="target" title="人气推荐" subTitle="人气爆款 不容错过">
    <div style="position: relative; height: 426px">
      <Transition name="fade">
        <ul class="goods-list" v-if="result.length" ref="pannel">
          <li v-for="item in result" :key="item.id">
            <RouterLink to="/">
              <img v-lazyLoad="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
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
// 引入接口
import { reqHome_hot } from "@/api/home";
// 数据懒加载
const { target,result } = useLazyData(reqHome_hot);
</script>
<style scoped lang="less">
@import "@/assets/styles/mixins.less";
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
