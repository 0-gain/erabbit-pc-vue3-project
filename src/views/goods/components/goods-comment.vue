<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}%</span><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: currTagIndex === index }"
            @click="changeTag(index, item)"
            v-for="(item, index) in commentInfo.tags"
            :key="index"
            >{{ item.title }}（{{ item.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        @click="changeSort(null)"
        :class="{ active: reqParams.sortField === null }"
        >默认</a
      >
      <a
        href="javascript:;"
        @click="changeSort('praiseCount')"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        >最热</a
      >
      <a
        href="javascript:;"
        @click="changeSort('createTime')"
        :class="{ active: reqParams.sortField === 'createTime' }"
        >最新</a
      >
    </div>
    <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user" v-if="item.member">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              v-for="i in item.score"
              :key="i + '1'"
              class="iconfont icon-wjx01"
            ></i>
            <i
              v-for="i in 5 - item.score"
              :key="i + '2'"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr" v-if="item.orderInfo">{{
              formatSpecs(item.orderInfo.specs)
            }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 使用图片预览组件 -->
          <GoodsCommentImage
            v-if="item.pictures.length"
            :pictures="item.pictures"
          >
          </GoodsCommentImage>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reqGoodsComments, reqGoodsPage } from "@/api/product";
import { ref, inject, reactive, watch } from "vue";
import GoodsCommentImage from "./goods-comment-image.vue";
const goods = inject("goods");
const commentInfo = ref({});
reqGoodsComments(goods.value.id).then(({ result }) => {
  // type 的目的是将来点击可以区分点的是不是标签
  result.tags.unshift({
    type: "img",
    title: "有图",
    tagCount: result.hasPictureCount,
  });
  result.tags.unshift({
    type: "all",
    title: "全部评价",
    tagCount: result.evaluateCount,
  });
  commentInfo.value = result;
});

// 当前所选择的评价索引
const currTagIndex = ref(0);
// 改变标签索引
const changeTag = (index, item) => {
  currTagIndex.value = index;
  reqParams.tag = item.title;
  reqParams.page = 1;
  if (item.type === "img") {
    reqParams.hasPicture = true;
  }
};

// 筛选条件准备
const reqParams = reactive({
  page: 1,
  pageSize: 10,
  hasPicture: null,
  tag: null,
  // 排序字段
  sortField: null,
});

// 更改排序
const changeSort = (sortField) => {
  reqParams.sortField = sortField;
  reqParams.page = 1;
};

// 监听初始化或者筛选条件的改变
const commentList = ref([]);
watch(
  reqParams,
  async () => {
    const data = await reqGoodsPage(goods.value.id, reqParams);
    commentList.value = data.result.items;
  },
  { immediate: true }
);

// 定义转换数据的函数（对应vue2.0的过滤器）
const formatSpecs = (specs) => {
  return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, "").trim();
};
const formatNickname = (nickname) => {
  return nickname.substr(0, 1) + "****" + nickname.substr(-1);
};
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
