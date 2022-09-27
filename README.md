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

## SKU和SPU
SPU：标准化产品单元。属性值、特性相同的商品就可以成为一个SPU（iphone13），代表一个商品，拥有很多相同的属性
SKU：库存量单位，即库存进出计量的单位， 可以是以件、盒、托盘等为单位。SKU是物理上不可分割的最小存货单元。在使用时要根据不同业态，不同管理模式来处理。代表该商品可选规格的任意组合，他是库存单位的唯一标识

## 过滤规格
当选择颜色为粉色的时候，就要去判断规格为大号和小号的库存