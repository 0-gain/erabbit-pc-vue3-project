// 封装插件

// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

/* import xtxSkeleton from "./xtx-skeleton.vue";
import xtxCarousel from "./xtx-carousel.vue";
import xtxMore from "./xtx-more.vue";
import xtxBread from "./xtx-bread.vue";
import xtxBreadItem from "./xtx-bread-item.vue"; */

// 导入library文件夹下的所有组件
/* webpack
批量导入需要使用一个函数require.context(dir,deep,matching) 
参数：1.目录 2.是否加载子目录 3.加载的正则匹配 
const importFn = require.context('./', false, /\.vue$/)
console.dir(importFn.keys()) 文件名称数组
*/

// vite
const components = import.meta.glob("./*.vue");

import { defineAsyncComponent } from "vue";
import Message from "./Message";
import Confirm from "./confirm";

export default {
  install(app) {
    /*      app.component('XtxSkeleton', xtxSkeleton)
     app.component('XtxCarousel', xtxCarousel)
     app.component(xtxMore.name, xtxMore)
     app.component('XtxBread', xtxBread)
     app.component('XtxBreadItem', xtxBreadItem) */

    //  批量注册全局组件
    for (const [key, value] of Object.entries(components)) {
      const name = key
        .slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."))
        .split("-");
      const arrName = name.map((curr) => {
        return curr.replace(curr[0], curr[0].toUpperCase());
      });
      app.component(arrName.join(""), defineAsyncComponent(value));
    }
    // 定义指令
    defineDirective(app);
  },
};

import defaultImg from "@/assets/images/200.png";
// 定义指令
const defineDirective = (app) => {
  // 1.图片懒加载指令v-lazy
  // 原理：先存储图片地址不能在src上，当图片进入可视区，将你存储图片地址设置给图片元素即可
  app.directive("lazyLoad", {
    // vue2.0 监听使用指令的DOM是否创建好，钩子函数：inserted
    // vue3.0 的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    mounted(el, binding) {
      // 2. 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el);
            // 3.把指令的值设置给el的src属性binding.value就是指令的值
            // 4.处理图片加载失败 error：图片加载失败的事件 load：图片加载成功
            el.onerror = () => {
              // 加载失败，设置默认图
              el.src = defaultImg;
            };
            el.src = binding.value;
          }
        },
        {
          threshold: 0,
        }
      );
      // 开启观察
      observe.observe(el);
    },
  });
};
