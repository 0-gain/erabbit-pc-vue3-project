<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{ showAddress.fullLocation + showAddress.address }}
        </li>
      </ul>
      <a
        @click="openAddressEdit(showAddress)"
        v-if="showAddress"
        href="javascript:;"
        >修改地址</a
      >
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
      <XtxButton class="btn" @click="$emit('deleteAddress')">删除地址</XtxButton>
    </div>
  </div>
  <XtxDialog title="切换收获地址" v-model:visible="toggleAddress">
    <div
      @click="selectedAddress = item"
      :class="{ active: selectedAddress && selectedAddress.id === item.id }"
      class="text item"
      v-for="item in list"
      :key="item.id"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template #footer>
      <XtxButton
        @click="toggleAddress = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>

  <AddressEdit @on-success="successHandler" ref="addressEditCom"></AddressEdit>
</template>

<script setup>
import XtxButton from "@/components/library/xtx-button.vue";
import XtxDialog from "@/components/library/xtx-dialog.vue";
import { ref } from "vue";
import { reqAddressList } from "@/api/order";
import AddressEdit from "./address-edit.vue";

const props = defineProps({
  // 收获地址列表
  list: {
    type: Array,
    default: ()=>[],
  },
});
const emit = defineEmits(["change","deleteAddress"]);
const showAddress = ref(null);

// 默认的收获地址
const defaultAddress = props.list.find((item) => item.isDefault === 0);
if (defaultAddress) {
  showAddress.value = defaultAddress;
} else {
  if (props.list.length) {
    showAddress.value = props.list[0];
  }
}

emit("change", showAddress.value && showAddress.value.id);

// 显示和控制切换地址
const toggleAddress = ref(false);

// 地址列表
const addressList = ref(null);

// 获取地址列表
reqAddressList().then(({ result }) => {
  addressList.value = result;
});

// 选择的地址
const selectedAddress = ref(null);
// 确认地址
const confirmAddress = () => {
  toggleAddress.value = false;
  showAddress.value = selectedAddress.value;
  emit("change", selectedAddress.value?.id);
};

const openDialog = () => {
  // 将之前的选中地址改成null
  selectedAddress.value = null;
  toggleAddress.value = true;
};

// 打开添加编辑收货地址组件
const addressEditCom = ref(null);
const openAddressEdit = (address) => {
  // 添加 {}  修改 {数据}
  addressEditCom.value.open(address);
};

// 成功
const successHandler = (formData) => {
  const editAddress = props.list.find((item) => item.id === formData.id);
  if (editAddress) {
    // 修改
    for (const key in editAddress) {
      editAddress[key] = formData[key];
    }
  } else {
    // 添加
    const json = JSON.stringify(formData); // 需要克隆下，不然使用的是对象的引用
    // eslint-disable-next-line vue/no-mutating-props
    props.list.unshift(JSON.parse(json));
  }
};

</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 100px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      margin-right: 10px;
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
