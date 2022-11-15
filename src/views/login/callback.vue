<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind"></i>
        <span>已有小鲜兔账户，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit"></i>
        <span>没有小鲜兔账户，请完善资料</span>
      </a>
    </nav>
    <div v-if="hasAccount" class="tab-content">
      <CallbackBind :unionId="unionId" />
    </div>
    <div v-else class="tab-content">
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
</template>

<script setup>
import LoginHeader from "./components/login-header.vue";
import CallbackBind from "./components/callback-bind.vue";
import CallbackPatch from "./components/callback-patch.vue";
import QC from "qc";
import { reqUserQQlogin } from "@/api/user";
import Message from "@/components/library/Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";

// 假设已经绑定，默认会去做一次登录，如果登录失败证明未绑定
const isBind = ref(true);

// 是否有账户
const hasAccount = ref(true);
// 第三方登录唯一标识unionId
const unionId = ref(null);

/* 
  1.获取QQ互联的openId也就是后台需要的unionId
  2.根据QQ互联的openId去进行登录
*/
const store = useStore();
const router = useRouter();

// 检查qq是否登录
if (QC.Login.check()) {
  QC.Login.getMe((openId) => {
    // openId 第三方标识
    unionId.value = openId;
    reqUserQQlogin(openId)
      .then((res) => {
        // 代表已注册已绑定
        // 1.存储用户信息
        const { id, account, mobile, avatar, nickname, token } = res.result;
        store.commit("user/SET_USER", {
          id,
          account,
          mobile,
          avatar,
          nickname,
          token,
        });
        // 合并购物车
        store.dispatch("cart/mergeLocalCart").then(() => {
          // 2.跳转到首页或者来源页
          router.push(store.state.user.redirectUrl);
          // 3.成功提示
          Message({ type: "success", text: "QQ登录成功" });
        });
      })
      .catch((e) => {
        // 代表没有注册没有绑定
        isBind.value = false;
      });
  });
}

// 未绑定有账户
</script>
<style scoped lang="less">
.container {
  padding: 25px 0;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
</style>
