// 定义首页需要的接口函数
import request from '@/utils/request'

/* 
    获取首页头部分类数据
*/

export const reqFind_All_Category = () => request.get('/home/category/head')

// 一级类目
export const reqTop_category = (id) => request.get('/category', {
    params: {
        id
    }
})

// 二级类目-筛选条件
export const reqCategorySub = (id) => request.get('/category/sub/filter', {
    params: {id}
})