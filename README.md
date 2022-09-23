## 组件数据懒加载
下包 npm i  @vueuse/core@5.3.0  或  yarn add @vueuse/core@5.3.0
导入 useIntersectionObserver  函数
import { useIntersectionObserver } from '@vueuse/core'
``const { stop } = useIntersectionObserver(target, fn, options)``
1. stop 一个可执行的函数用来停止监听行为
2. target 表示被监听的DOM元素，必须是dom容器，而且是vue3.0方式绑定的dom对象
3. isIntersecting 一个类型为布尔值的数据 当被监听元素进入视口区域时为 true ,离开视口区域时为 false
4. observerElement 被观察的dom
```
<!-- 可以将target作为形参引入，这样就可以不用将target返回 -->

export const useLazyData = (apiFn) => {
    // 需要：1.被观察的对像，2.不同的API函数
    const {
        stop
    } = useIntersectionObserver(target, ([{
        isIntersecting
    }], observerElement) => {
        if (isIntersecting) {
            // 进入视口区域，停止监听
            stop()
            // 调用API获取数据
            apiFn().then(data => {
                result.value = data.result
            })
        }
    })
    return {
      <!-- 一定要将target返回，并且解构target -->
        target,
        result
    }
}
**◆特别注意:** 对于目标target是否进入视口区域的监听会一直进行不会只监听一次,可以 stop（） 关闭监听
```

## 图片懒加载
基于vue3.0和IntersectionObserver封装懒加载指令
