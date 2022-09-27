<template>
  <div class="goods-sku">
    <dl v-for="s in goods.specs" :key="s.id">
      <dt>{{ s.name }}</dt>
      <dd>
        <template v-for="(val, index) in s.values" :key="index">
          <img
            v-if="val.picture"
            :class="[{ selected: val.selected }, { disabled: val.isDisabled }]"
            @click="handleSpecs(s, val)"
            :src="val.picture"
            alt=""
          />
          <span
            :class="[{ selected: val.selected }, { disabled: val.isDisabled }]"
            @click="handleSpecs(s, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  goods: { type: Object, default: () => ({ specs: [], skus: [] }) },
});

// 用来存储当前所点击的选项
const selectedObj = ref({});
const handleSpecs = (item, val) => {
  if (val.selected) {
    val.selected = false;
    // // 将所有的isDisabled=false
    // props.goods.specs.forEach((spec) => {
    //   spec.values.forEach((el) => {
    //     el.isDisabled = false;
    //   });
    // });
    if (selectedObj.value.hasOwnProperty(item.name)) {
      delete selectedObj.value[item.name];
    }
  } else if (val.isDisabled) return;
  else {
    //   排他
    item.values.forEach((el) => {
      el.selected = false;
    });
    val.selected = true;
    selectedObj.value[item.name] = val.name;
    // specMap(item, val);
  }
};

watch(
  selectedObj,
  (newVal) => {
    // 获取所有的value值
    const arr = Object.values(newVal);
    // 找到arr存在的值的数组
    const selectedArr = [];
    props.goods.skus.forEach((sku) => {
      sku.specs.forEach((el) => {
        if (arr.some((item) => item === el.valueName) && sku.inventory < 9000) {
          selectedArr.push(sku.specs);
        }
      });
    });
    // 找出需要禁用的数据
    let disableArr = [];
    selectedArr.forEach((el) => {
      el.forEach((item) => {
        if (arr.some((v) => v != item.valueName)) {
          disableArr.push(item);
        }
      });
    });

    // 过滤出disableArr中含有点击得选项
    disableArr = disableArr.filter((el) => {
      return arr.every((v) => v !== el.valueName);
    });
    // // 给specs中不足库存的属性添加disabled
    props.goods.specs.forEach((spec) => {
      spec.values.forEach((el) => {
        el.isDisabled = false;
        if (disableArr.some((v) => v.valueName === el.name)) {
          el.isDisabled = true;
        }
      });
    });
  },
  { deep: true }
);
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
