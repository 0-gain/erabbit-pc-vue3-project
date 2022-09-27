import { useIntersectionObserver, useMouseInElement } from "@vueuse/core";
import { reactive, ref, watch } from "vue";

// 数据懒加载
export const useLazyData = (apiFn) => {
  // 需要：1.被观察的对像，2.不同的API函数
  const target = ref(null);
  const result = ref([]);
  // 1. stop 一个可执行的函数用来停止监听行为
  // 2. target 一个由 ref api 调用之后形成的 RefImpl 对象 也可以是一个 dom 对象
  // 3. isIntersecting 一个类型为布尔值的数据 当被监听元素进入视口区域时为 true ,离开视口区域时为 false
  // 4. observerElement 被观察的dom
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 进入视口区域，停止监听
        stop();
        // 调用API获取数据
        apiFn &&
          apiFn().then((data) => {
            result.value = data.result;
          });
      }
    },
    {
      // threshold 容器和可视区交叉的占比（进入的面积/容器完整面试） 取值，0-1 之间，默认比0大，所以需要滚动较多才能触发进入可视区域事件。
      threshold: 0,
    }
  );
  return {
    target,
    result,
  };
};

// 放大镜(获取鼠标偏移量)
export const usePreviewImg = () => {
  const target = ref(null);
  const show = ref(false);

  // elementX     鼠标基于容器左上角X轴偏移
  // elementY     鼠标基于容器左上角Y轴偏移
  // isOutside    鼠标是否在容器外面
  const { elementX, elementY, isOutside } = useMouseInElement(target);
  //   遮罩层的位置
  const position = reactive({ left: 0, top: 0 });
  //   大图的位置
  const bgPosition = reactive({
    backgroundPositionX: 0,
    backgroundPositionY: 0,
  });

  watch([elementX, elementY, isOutside], () => {
    // 控制X轴方向的定位0-200之间
    if (elementX.value < 100) position.left = 0;
    else if (elementX.value > 300) position.left = 200;
    else {
      position.left = elementX.value - 100;
    }
    // 控制Y轴方向的定位0-200之间
    if (elementY.value < 100) position.top = 0;
    else if (elementY.value > 300) position.top = 200;
    else position.top = elementY.value - 100;

    // 设置大背景的定位
    bgPosition.backgroundPositionX = -position.left * 2 + "px";
    bgPosition.backgroundPositionY = -position.top * 2 + "px";
    // 设置遮罩容器的定位
    position.left = position.left + "px";
    position.top = position.top + "px";
    // 设置是否显示预览大图
    show.value = !isOutside.value;
  });
  return { target, position, bgPosition,show };
};
