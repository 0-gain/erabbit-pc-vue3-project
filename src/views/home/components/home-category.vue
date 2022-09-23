<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <li
        :class="{ active: categoryId && categoryId === item.id }"
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="categoryId = item.id"
      >
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <RouterLink
            :to="`/category/sub/${c.id}`"
            v-for="c in item.children"
            :key="c.id"
            >{{ c.name }}</RouterLink
          >
        </template>

        <!-- 骨架 -->
        <template v-else>
          <XtxSkeleton
            height="18px"
            width="60px"
            bg="rgba(255,255,255,0.2)"
            style="margin-right: 5px"
          ></XtxSkeleton>
          <XtxSkeleton
            height="18px"
            width="50px"
            bg="rgba(255,255,255,0.2)"
          ></XtxSkeleton>
        </template>
      </li>
    </ul>

    <!-- 弹层 -->
    <div class="layer" v-if="currCategory">
      <h4>
        {{ currCategory && currCategory.id === "brand" ? "品牌" : "分类" }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul>
        <li v-for="sub in currCategory.goods" :key="sub.id">
          <RouterLink to="/">
            <img :src="sub.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ sub.desc }}</p>
              <p class="desc ellipsis">{{ sub.name }}</p>
              <p class="price"><i>¥</i>{{ sub.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <!-- 品牌 -->
      <ul>
        <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ brand.place }}
              </p>
              <p class="name ellipsis">{{ brand.name }}</p>
              <p class="desc ellipsis-2">{{ brand.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { reactive, computed, ref } from "vue";
import { reqFind_Brand } from "@/api/home";

const store = useStore();
// 给侧边栏新增一个品牌选项
const brand = reactive({
  id: "brand",
  name: "品牌",
  children: [{ id: "brand-children", name: "品牌推荐" }],
  // 品牌列表
  brands: [],
});
// 侧边栏数据
const menuList = computed(() => {
  const list = store.state.category.categoryList.map((item) => {
    return {
      id: item.id,
      name: item.name,
      // 防止初始化没有children的时候调用slice函数报错
      children: item.children && item.children.slice(0, 2),
      goods: item.goods,
    };
  });
  list.push(brand);
  return list;
});

// 弹出层
const categoryId = ref(null);
const currCategory = computed(() => {
  return menuList.value.find((item) => item.id === categoryId.value);
});

// 获取品牌数据
reqFind_Brand(6).then((date) => {
  brand.brands = date.result;
});
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
