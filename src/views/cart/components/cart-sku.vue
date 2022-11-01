<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="!goods"></div>
      <GoodsSku v-if="goods" :goods="goods" @change="changeSku"></GoodsSku>
      <XtxButton
        v-if="goods"
        size="mini"
        type="primary"
        @change="addCart"
        style="margin-left: 60px"
        >确认</XtxButton
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { reqGoodsSku } from "@/api/product";
import { onClickOutside } from "@vueuse/core";
import GoodsSku from "@/views/goods/components/goods-sku.vue";

const props = defineProps({
  attrsText: {
    type: String,
    default: "",
  },
  skuId: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(['change'])

const goods = ref(null);

const visible = ref(false);
const show = () => {
  visible.value = true; // 获取商品详情-sku
  reqGoodsSku(props.skuId).then((res) => {
    goods.value = res.result;
  });
};
const hide = () => {
  visible.value = false
  goods.value = null
};
const toggle = () => {
  visible.value ? hide() : show();
};

const target = ref(null);
onClickOutside(target, () => {
  hide();
});

// 选择sku时触发
const currSku = ref(null)
const changeSku = (sku)=>{
  currSku.value = sku
}

// 点击确认时，提交给sku信息给购物车组件
const addCart = () => {
  if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
    emit('change',currSku.value)
    hide()
  } 
};
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
