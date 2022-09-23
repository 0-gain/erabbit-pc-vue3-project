import {
    useIntersectionObserver
} from "@vueuse/core";
import {
    ref
} from 'vue'

export const useLazyData = (apiFn) => {
    // 需要：1.被观察的对像，2.不同的API函数
    const target = ref(null)
    const result = ref([])
    // 1. stop 一个可执行的函数用来停止监听行为
    // 2. target 一个由 ref api 调用之后形成的 RefImpl 对象 也可以是一个 dom 对象
    // 3. isIntersecting 一个类型为布尔值的数据 当被监听元素进入视口区域时为 true ,离开视口区域时为 false
    // 4. observerElement 被观察的dom
    const {
        stop
    } = useIntersectionObserver(target, ([{
        isIntersecting
    }], observerElement) => {
        if (isIntersecting) {
            // 进入视口区域，停止监听
            stop()
            // 调用API获取数据
            apiFn && apiFn().then(data => {
                result.value = data.result
            })
        }
    }, {
        // threshold 容器和可视区交叉的占比（进入的面积/容器完整面试） 取值，0-1 之间，默认比0大，所以需要滚动较多才能触发进入可视区域事件。
        threshold: 0
    })
    return {
        target,
        result
    }
}