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
import { ref, watch, onMounted } from "vue";
const props = defineProps({
  goods: { type: Object, default: () => ({ specs: [], skus: [] }) },
});
const emit = defineEmits(["change"]);

onMounted(() => {
  startDisabled();
});

// 禁用，库存不超过0的
const startDisabled = () => {
  const { goods } = props;
  // 如果只有一个规格则需要，当页面一加载时，就要去禁用库存不足的
  if (goods.specs.length === 1) {
    // 存储过滤出来的数组
    let arr = [];
    goods.skus.forEach((el) => {
      if (el.inventory < 0) {
        el.specs.forEach((v) => {
          arr.push(v.valueName);
        });
      }
    });

    // 禁用goods.specs中与arr的valueName相对应的
    goods.specs[0].values.forEach((el) => {
      if (arr.some((v) => v == el.name)) {
        el.isDisabled = true;
      }
    });
  }
};

// 用来存储当前所点击的选项
const selectedObj = ref({});

const handleSpecs = (item, val) => {
  if (val.selected) {
    val.selected = false;
    if (selectedObj.value.hasOwnProperty(item.name)) {
      delete selectedObj.value[item.name];
    }
    emit("change", null);
  } else if (val.isDisabled) return;
  else {
    //   排他
    item.values.forEach((el) => {
      el.selected = false;
    });
    val.selected = true;
    selectedObj.value[item.name] = val.name;
  }
};

// (主要用于，点击当前选项后，禁用其他类型的规格没有库存的)
watch(
  selectedObj,
  (newVal) => {
    // 获取所有的value值
    const arr = Object.values(newVal);

    // 给父组件传递库存数据
    if (arr.length === props.goods.specs.length) {
      let res = props.goods.skus;
      arr.forEach((v) => {
        res = res.filter((sku) => {
          if (sku.specs.some((el) => el.valueName === v)) {
            return sku;
          }
        });
      });
      const sku = res[0];
      emit("change", {
        skuId: sku.id,
        price: sku.price,
        oldPrice: sku.oldPrice,
        inventory: sku.inventory,
        // 属性名：属性值 属性名1：属性值1...
        specsText: sku.specs
          .reduce((p, c) => `${p} ${c.name}：${c.valueName}`, "")
          .trim(),
      });
    }

    if (props.goods.specs.length === 1) {
      return;
    }

    // 找到arr存在的值的数组
    const selectedArr = [];
    props.goods.skus.forEach((sku) => {
      sku.specs.forEach((el) => {
        if (arr.some((item) => item === el.valueName) && sku.inventory < 0) {
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

    // 给specs中不足库存的属性添加disabled
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
