import { createRouter, createWebHistory,createWebHashHistory } from "vue-router";

const router = createRouter({
  // todo 去除路由中的#号（history模式）
  // history: createWebHistory(import.meta.env.BASE_URL),
  history:createWebHashHistory(),
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
          path: "/member",
          component: () => import("@/views/member/layout.vue"),
          children: [
            {
              path: "/member",
              component: () => import("@/views/member/home/index.vue"),
            },
          ],
        },
        {
          path:'/car',
          component:()=>import('@/views/cart/index.vue')
        }
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/login/index.vue")
    },
    {
      path:'/login/callback',
      component:()=>import("@/views/login/callback.vue")
    },
    {
      path: "/login/callback",
      component: () => import("@/views/login/callback.vue"),
    },
  ],
});

export default router;
