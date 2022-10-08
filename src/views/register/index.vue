<template>
  <div class="container">
    <h3>新用户注册</h3>
    <Form
      ref="formCom"
      class="xtx-form"
      @submit="register"
      :validation-schema="formSchema"
      v-slot="{ errors }"
    >
      <div
        class="xtx-form-item"
        v-for="field in formData.fields"
        :key="field.name"
      >
        <span class="iconfont" :class="field.icon"> </span>
        <Field
          :as="field.as"
          type="text"
          :name="field.name"
          :placeholder="field.label"
          v-model="form[field.name]"
        />
        <a
          href="javascript:;"
          class="code"
          @click="send()"
          v-if="field.name === 'code'"
        >
          {{ time <= 0 ? "发送验证码" : `${time}秒后发送` }}</a
        >
        <div class="error" v-if="errors[field.name]">
          <i class="iconfont icon-warning" />{{ errors[field.name] }}
        </div>
      </div>

      <div class="xtx-form-item">
        <div class="agree">
          <Field as="XtxCheckbox" v-model="form.isAgree" name="isAgree" />
          已阅读并同意
          <i>《用户服务协议》</i>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors["isAgree"] }}
        </div>
      </div>

      <XtxButton size="large" type="primary" :isDisable="isDisable"
        >立即注册</XtxButton
      >
    </Form>
  </div>
</template>

<script setup>
import { Form, Field } from "vee-validate";
import { useIntervalFn } from "@vueuse/core";
import { reactive, ref, watch, onUnmounted } from "vue";
import { reqRegister, reqCode } from "@/api/user";
import schema from "@/utils/vee-validate-schema";

// 是否禁用注册按钮
const isDisable = ref(true);

const formCom = ref(null);

// 动态生成表单
const formData = {
  fields: [
    {
      label: "设置用户名",
      name: "account",
      as: "input",
      icon: "icon-user",
    },
    {
      label: "请输入手机号码",
      name: "mobile",
      as: "input",
      icon: "icon-phone",
    },
    {
      label: "短信验证码",
      name: "code",
      as: "input",
      icon: "icon-code",
    },
    {
      label: "设置6至20位字母、数字和符号组合",
      name: "password",
      as: "input",
      icon: "icon-lock",
    },
  ],
};

// 表单信息对象
const form = reactive({
  isAgree: true,
  account: "",
  mobile: "",
  code: "",
  password: "",
});

// 验证信息
const formSchema = reactive({
  isAgree: schema.isAgree,
  account: schema.account,
  mobile: schema.mobile,
  code: schema.code,
  password: schema.password,
});

// 倒计时
const time = ref(0);
// pause 暂停 resume开始  useIntervalFn(回调函数,执行间隔,是否立即开启)
const { pause, resume, isActive } = useIntervalFn(
  () => {
    time.value--;
    console.log("定时器开启");
    if (time.value <= 0) pause();
  },
  1000,
  { immediate: false }
);

onUnmounted(() => {
  pause();
});

// 发送短信
const send = async () => {
  const valid = schema.mobile(form.mobile);
  if (valid === true) {
    // 通过
    if (!time.value) {
      // 没有倒计时才可以发送
      await reqCode(form.mobile, register).then((res) => {
        console.log(res);
      });
      time.value = 60;
      resume();
    }
  } else {
    // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
    formCom.value.setFieldError("mobile", valid);
  }
};

// 侦听是否验证完毕
watch(form, async () => {
  const valid = await formCom.value.validate();
  if (valid) {
    // isDisable为true
    isDisable.value = false;
  }
});

// 注册
const register = () => {
  const { account, mobile, code, password } = form;
  let obj = { account, mobile, code, password };
  reqRegister(obj)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response.data.message);
    });
};
</script>
<style scoped lang="less">
.container {
  margin-top: 50px;
  background-color: #fff;
  min-height: 800px;
  h3 {
    font-size: 26px;
    font-weight: 400;
    color: #999;
    padding-left: 50px;
    height: 180px;
    line-height: 180px;
  }
  .xtx-form {
    padding-left: 460px;
    .xtx-form-item {
      position: relative;
      padding-bottom: 24px;
      span {
        position: absolute;
        left: 15px;
        top: 13px;
        color: #999;
        font-size: 18px;
      }
      input {
        width: 300px;
        height: 50px;
        border: 1px solid #e4e4e4;
        padding-left: 40px;
      }
      .error {
        display: inline-block;
        color: #cf4444;
        padding-left: 10px;
      }
      i {
        font-size: 14px;
      }
      .code {
        position: absolute;
        left: 210px;
        top: 16px;
        color: #27ba9b;
      }
      .agree {
        text-align: center;
        width: 300px;
        display: inline-block;
        line-height: 50px;
        i {
          color: #27ba9b;
          font-size: 14px;
        }
      }
    }
  }
  :deep(button) {
    width: 300px;
  }
}
</style>
