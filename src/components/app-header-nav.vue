<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li
      v-for="(item, index) in categoryList"
      :key="index"
      @mouseenter="show(item)"
      @mouseleave="hide(item)"
    >
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{
        item.name
      }}</router-link>
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="(c, index) in item.children" :key="index">
            <router-link :to="`/category/sub/${c.id}`" @click="hide(item)">
              <img :src="c.picture" alt="" />
              <p>{{ c.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
store.dispatch("category/getAllCategory");
const categoryList = computed(() => {
  return store.state.category.categoryList;
});
const show = (item) => {
  store.commit("category/SHOW", item);
};
const hide = (item) => {
  store.commit("category/HIDE", item);
};
</script>
<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
  &.open {
    height: 132px;
    opacity: 1;
  }
}
</style>
