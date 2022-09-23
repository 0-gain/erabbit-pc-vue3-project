<template>
  <HomePanel  ref="target" title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
    <template v-slot:right>
      <XtxMore></XtxMore>
    </template>
    <div style="position: relative; height: 406px">
      <Transition name="fade">
        <ul v-if="result.length" ref="pannel" class="goods-list">
          <li v-for="item in result" :key="item.id">
            <RouterLink to="/">
              <img v-lazyLoad="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else/>
      </Transition>
    </div>
  </HomePanel>
</template>

<script setup>
import HomePanel from "./home-panel.vue";
import HomeSkeleton from "./home-skeleton.vue";
import {useLazyData} from '@/hooks/index'
// 引入接口
import { reqHome_new } from "@/api/home";

// 数据懒加载
const {target,result} = useLazyData(reqHome_new)
</script>
<style scoped lang="less">
@import "@/assets/styles/mixins.less";
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
