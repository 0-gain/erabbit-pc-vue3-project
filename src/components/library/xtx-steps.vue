<template>
  <!-- 静态步骤条 -->
  <renderStepsItem />
</template>

<script setup lang="jsx">
import { getCurrentInstance } from "vue";
const props = defineProps({
  active: {
    type: Number,
    default: 1,
  },
});

// console.log("1", getCurrentInstance());
// 获取当前组件的上下文
const { ctx } = getCurrentInstance(); //只能在开发环境下使用，生产环境下的ctx将访问不到
const { proxy } = getCurrentInstance(); //此方法在开发环境以及生产环境下都能访问
const renderStepsItem = () => {
  // console.log("2", getCurrentInstance());
  const items = ctx.$slots.default();
  const dynamicItems = [];
  items.forEach((el) => {
    dynamicItems.push(el);
  });

  const itemsJsx = dynamicItems.map((item, index) => {
    return (
      <div class={["xtx-steps-item", index < props.active ? "active" : ""]}>
        <div class="step">
          <span>{index + 1}</span>
        </div>
        <div class="title">{item.props.title}</div>
        <div class="desc">{item.props.desc}</div>
      </div>
    );
  });
  return <div class="xtx-steps">{itemsJsx}</div>;
};
</script>
<style scoped lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  :deep(&-item) {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff;
        }
        &::before,
        &::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
