import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          path:'product/:id',
          component:()=>import('@/views/goods/index.vue')
        }
      ],
    },
  ],
});

export default router;
