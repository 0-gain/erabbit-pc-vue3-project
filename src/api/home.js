// 定义首页需要的接口函数
import request from "@/utils/request";

// 获取首页热门品牌数据
export const reqFind_Brand = (limit) =>
  request.get("/home/brand", {
    params: {
      limit
    }
  });

// 获取banner
export const reqBanner = () => request.get("/home/banner");

// 新鲜好物
export const reqHome_new = () => request.get('/home/new')

// 人气推荐
export const reqHome_hot = () => request.get('/home/hot')

// 热门品牌
export const reqHome_brand = (limit) => request.get('/home/brand', {
  params: {
    limit
  }
})

// 产品区块
export const reqHome_good = () => request.get('/home/goods')

// 最新专题
export const reqHome_special = () => request.get('/home/special')