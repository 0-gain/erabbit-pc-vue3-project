// 实现函数式调用xtx-confirm组件
import { createVNode, render } from "vue";
import XtxConfirm from "./xtx-confirm.vue";

// 准备dom容器
const div = document.createElement("div");
div.setAttribute("class", "xtx-confirm-container");
document.body.appendChild(div);

// 渲染XtxConfirm组件的标题和文本
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div);
      resolve();
    };
    const cancelCallback = () => {
      render(null, div);
      reject(new Error("点击取消"));
    };

    const vnode = createVNode(XtxConfirm, {
      title,
      text,
      submitCallback,
      cancelCallback,
    });
    render(vnode, div);
  });
};
