<template>
  <XtxDialog
    :title="(formData.id ? '编辑' : '添加') + '收货地址'"
    v-model:visible="dialogVisible"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="formData.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="formData.contact"
              name="contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              placeholder="请选择所在地区"
              :fullLocation="formData.fullLocation"
              @change="changeCity"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="formData.address"
              name="address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="formData.postalCode"
              name="postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="formData.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton
        @click="dialogVisible = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script setup>
import XtxDialog from "@/components/library/xtx-dialog.vue";
import Message from "@/components/library/Message";

import { reqOrderAddress, reqEditAddress } from "@/api/order";
import { ref, reactive } from "vue";

const dialogVisible = ref(false);

const emit = defineEmits(["on-success"]);

// 打开函数
const open = (address) => {
  if (address.id) {
    for (const key in formData) {
      formData[key] = address[key];
    }
  } else {
    for (const key in formData) {
      if (key !== "isDefault") {
        formData[key] = "";
      }
    }
  }
  dialogVisible.value = true;
};
// 将open()函数暴露出去给父组件用
defineExpose({ open });

// 表单数据
const formData = reactive({
  id: "",
  receiver: "",
  contact: "",
  provinceCode: "",
  cityCode: "",
  countyCode: "",
  address: "",
  postalCode: "",
  addressTags: "",
  isDefault: 0,
  fullLocation: "",
});

// 改变城市
const changeCity = (cityInfo) => {
  const { cityCode, provinceCode, countyCode, fullLocation } = cityInfo;
  formData.cityCode = cityCode;
  formData.provinceCode = provinceCode;
  formData.countyCode = countyCode;
  formData.fullLocation = fullLocation;
};

// 提交
const submit = () => {
  if (!/^1[3-9]\d{9}$/.test(formData.contact)) {
    Message({ text: "手机号码格式不对", type: "error" });
    return;
  }

  if (formData.id) {
    // 修改地址
    reqEditAddress(formData)
      .then((data) => {
        Message({ text: "修改收获地址成功", type: "success" });
        dialogVisible.value = false;
        emit("on-success", formData);
        
      })
      .catch((err) => {
        Message({ text: "修改收获地址失败", type: "error" });
        dialogVisible.value = false;
      });
    return;
  }
  
  reqOrderAddress(formData)
    .then(({ result }) => {
      let { id } = result;
      dialogVisible.value = false;
      Message({ text: "添加地址成功", type: "success" });
      // 触发自定义事件
      emit('on-success', formData)
    })
    .catch((err) => {
      Message({ text: err.message.split(",")[0] || "添加失败", type: "error" });
    });
};
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}

.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
