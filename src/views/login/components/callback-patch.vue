<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          name="account"
          v-model="form.account"
          class="input"
          :class="{ err: errors.account }"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          name="mobile"
          v-model="form.mobile"
          class="input"
          :class="{ err: errors.mobile }"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          name="code"
          v-model="form.code"
          class="input"
          :class="{ err: errors.code }"
          type="text"
          placeholder="请输入验证码"
        />
        <span @click="send()" class="code">{{
          time === 0 ? "发送验证码" : time + "秒后发送"
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="password"
          v-model="form.password"
          class="input"
          :class="{ err: errors.password }"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="rePassword"
          v-model="form.rePassword"
          class="input"
          :class="{ err: errors.rePassword }"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script setup>
import { Form, Field } from "vee-validate";
import schema from "@/utils/vee-validate-schema";
import { useIntervalFn } from "@vueuse/core";
import { reqUserQQLoginComplement, reqQQPatchCode } from "@/api/user";
import Message from "@/components/library/Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";

const props = defineProps({
  unionId: {
    type: String,
    default: "",
  },
});

/*
  1.表单校验
  2.发送短信验证码：接口API定义
  3.完善信息
*/
// 收集数据的表单
const form = reactive({
  account: "",
  mobile: "",
  password: "",
  rePassword: "",
  code: "",
});

// 校验规则
const mySchema = {
  account: schema.account,
  mobile: schema.mobile,
  password: schema.password,
  rePassword: schema.rePassword,
  code: schema.code,
};

// 短信验证码倒计时
const time = ref(0);
const formCom = ref(null); //绑定ref
const { pause, resume } = useIntervalFn(
  () => {
    time.value--;
    if (time.value <= 0) {
      pause();
    }
  },
  1000,
  false
);
onMounted(() => {
  pause();
});

// 1. 发送验证码
// 1.1 绑定发送验证码按钮点击事件
// 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
// 1.3 如果失败，失败的校验样式显示出来
const send = async () => {
  const valid = mySchema.mobile(form.mobile);
  if (valid === true) {
    // 通过
    if (time.value === 0) {
      // 没有倒计时才可以发送
      await reqQQPatchCode(form.mobile);
      Message({ type: "success", text: "发送成功" });
      time.value = 60;
      resume();
    }
  } else {
    // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
    formCom.value.setFieldError("mobile", valid);
  }
};

// 提交
const store = useStore();
const router = useRouter();
const submit = async () => {
  const valid = formCom.value.validate();
  if (valid) {
    reqUserQQLoginComplement({
      unionId: props.unionId,
      ...form,
    })
      .then((data) => {
        // 实现和之前登录一样的逻辑
        // 1. 存储用户信息
        const { id, account, avatar, mobile, nickname, token } = data.result;
        store.commit("user/SET_USER", {
          id,
          account,
          avatar,
          mobile,
          nickname,
          token,
        });
        // 2. 跳转到来源页或者首页
        router.push(store.state.user.redirectUrl);
        // 3. 成功提示
        Message({ type: "success", text: "QQ完善信息成功" });
      })
      .catch((e) => {
        Message({ type: "error", text: "完善信息失败" });
      });
  }
};
</script>
<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
