<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" :validation-schema="formSchema" v-slot="{ errors }">
      <div class="form">
        <template v-if="!isMsgLogin">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field
                :class="{ error: errors.account }"
                type="text"
                name="account"
                v-model="form.account"
                placeholder="请输入用户名或手机号"
              />
            </div>
            <div class="error" v-if="errors.account">
              <i class="iconfont icon-warning" />{{ errors["account"] }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <Field
                :class="{ error: errors.password }"
                type="password"
                name="password"
                v-model="form.password"
                placeholder="请输入密码"
              />
            </div>
            <div class="error" v-if="errors.password">
              <i class="iconfont icon-warning" />{{ errors["password"] }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field
                :class="{ error: errors.phone }"
                type="text"
                name="phone"
                v-model="form.phone"
                placeholder="请输入手机号"
              />
            </div>
            <div class="error" v-if="errors.phone">
              <i class="iconfont icon-warning" />{{ errors["phone"] }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <Field
                :class="{ error: errors.code }"
                type="text"
                v-model="form.code"
                name="code"
                placeholder="请输入验证码"
              />
              <span class="code">发送验证码</span>
            </div>
            <div class="error" v-if="errors.code">
              <i class="iconfont icon-warning" />{{ errors["code"] }}
            </div>
          </div>
        </template>
        <div class="form-item">
          <div class="agree">
            <Field as="XtxCheckbox" v-model="form.isAgree" name="isAgree" />
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </div>
          <div class="error" v-if="errors.isAgree">
            <i class="iconfont icon-warning" />{{ errors["isAgree"] }}
          </div>
        </div>
        <a @click="login()" href="javascript:;" class="btn">登录</a>
      </div>
    </Form>

    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <router-link to="/register">免费注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Field, Form } from "vee-validate";
import { reqAccountLogin } from "@/api/user";
import Message from "@/components/library/Message";
import schema from "@/utils/vee-validate-schema";

// 是否短信登录
const isMsgLogin = ref(false);

// 表单信息对象
const form = reactive({
  isAgree: true,
  account: "",
  phone: "",
  code: "",
  password: "",
});

// 验证信息
const formSchema = reactive({
  isAgree: schema.isAgree,
  account: schema.account,
  phone: schema.mobile,
  code: schema.code,
  password: schema.password,
});

// 点击登录时，整体校验
const formCom = ref(null);
const login = async () => {
  // Form组件提供一个validate函数作为整体表单校验，返回的是一个promise
  const valid = await formCom.value.validate();
  if (valid) {
    getAccountLogin();
  }
};

// 登录
const store = useStore();
const route = useRoute();
const router = useRouter();

const getAccountLogin = () => {
  reqAccountLogin(form)
    .then(({ result }) => {
      // 1.存储信息
      const { id, account, nickname, avatar, token, mobile } = result;
      store.commit("user/SET_USER", {
        id,
        account,
        nickname,
        avatar,
        token,
        mobile,
      });
      // 合并购物车操作
      store.dispatch("cart/mergeLocalCart").then(() => {
        // 2.提示
        Message({ type: "success", text: "登录成功" });
        // 3.跳转
        router.push(route.query.redirectUrl || "/");
      });
    })
    .catch((e) => {
      Message({ type: "error", text: e.response.data.message || "登录失败" });
    });
};
</script>
<style scoped lang="less">
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
            // height: 200px;
            // background-color: red;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
