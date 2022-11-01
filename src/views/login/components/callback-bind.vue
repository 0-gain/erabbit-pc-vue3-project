<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="user-info">
      <img
        :src="
          avatar
            ? avatar
            : 'http://qzapp.qlogo.cn/qzapp/101941968/57C7969540F9D3532451374AA127EE5B/50'
        "
        alt=""
      />
      <p>
        Hi，{{ nickname || "Tom" }}
        欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~
      </p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          v-model="form.mobile"
          :class="{ err: errors.mobile }"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          :class="{ err: errors.code }"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span @click="send()" class="code">{{
          time === 0 ? "发送验证码" : time + "秒后发送"
        }}</span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script setup>
import QC from "qc";
import { reqUserQQcode, reqUserQQlogin } from "@/api/user";
import { Form, Field } from "vee-validate";
import schema from "@/utils/vee-validate-schema";
import { useIntervalFn } from "@vueuse/core";
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Message from "@/components/library/Message";
const props = defineProps({
  unionId: {
    type: String,
    default: "",
  },
});

const nickname = ref("null");
const avatar = ref("null");

// 查看是否登录
if (QC.Login.check()) {
  // 获取登录用户的昵称、头像、性别
  QC.api("get_user_info").success((res) => {
    avatar.value = res.data.figureurl_1;
    nickname.value = res.data.nickname;
  });
}

// 表单数据对象
const form = reactive({
  mobile: null,
  code: null,
});
// 校验规则对象
const mySchema = {
  mobile: schema.mobile,
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

/*
  发送短信验证码
*/
const send = async () => {
  const valid = mySchema.mobile(form.mobile);
  if (valid === true) {
    // 通过
    if (time.value === 0) {
      // 没有倒计时才可以发送
      let res = await reqUserQQcode(form.mobile);
      Message({ type: "success", text: "发送成功" });
      time.value = 60;
      resume();
      console.log(res);
    }
  } else {
    // 手机校验失败
    formCom.value.setFieldError("mobile", valid);
  }
};
// 立即绑定
const store = useStore();
const router = useRouter();
const submit = async () => {
  const valid = formCom.value.validate();
  // 都校验成功
  if (valid) {
    reqUserQQlogin({ unionId: props.unionId, ...form })
      .then((res) => {
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
        Message({ type: "success", text: "QQ绑定成功" });
      })
      .catch((e) => {
        Message({ type: "error", text: "绑定失败" });
      });
  }
};
</script>
<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
