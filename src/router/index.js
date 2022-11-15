import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouterView,
} from "vue-router";

import store from "@/store";

const router = createRouter({
  // todo 去除路由中的#号（history模式）
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: () => import("@/Layout/index.vue"),
      redirect: "/home",
      children: [
        {
          path: "home",
          component: () => import("@/views/home/index.vue"),
        },
        {
          path: "category/:id",
          component: () => import("@/views/category/index.vue"),
        },
        {
          path: "category/sub/:id",
          component: () => import("@/views/category/sub.vue"),
        },
        {
          path: "product/:id",
          component: () => import("@/views/goods/index.vue"),
        },
        {
          path: "/register",
          component: () => import("@/views/register/index.vue"),
        },
        {
          path: "/car",
          component: () => import("@/views/cart/index.vue"),
        },
        {
          path: "/member/checkout",
          component: () => import("@/views/member/pay/checkout.vue"),
        },
        {
          path: "/member/pay",
          component: () => import("@/views/member/pay/index.vue"),
        },
        {
          path: "/pay/callback",
          component: () => import("@/views/member/pay/result.vue"),
        },
        {
          path: "/member",
          component: () => import("@/views/member/layout.vue"),
          children: [
            {
              path: "/member",
              component: () => import("@/views/member/home/index.vue"),
            },
            {
              path: "/member/order",
              // 创建一个RouterView容器形成嵌套关系
              component: RouterView,
              children: [
                {
                  path: "",
                  component: () => import("@/views/member/order/index.vue"),
                },
                { path: ":id", component: ()=>import("@/views/member/order/order-detail.vue") },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/login/callback",
      component: () => import("@/views/login/callback.vue"),
    },
  ],
});

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const { token } = store.state.user.profile;
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith("/member") && !token) {
    next({ path: "/login", query: { redirectUrl: to.fullPath } });
  }
  next();
});
export default router;
