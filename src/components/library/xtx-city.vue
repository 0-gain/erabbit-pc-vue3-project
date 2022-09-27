<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{ active }">
      <span class="placeholder">{{ fullLocation }}</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          @click="changeCity(city)"
          class="ellipsis"
          v-for="city in currList"
          :key="city.code"
          >{{ city.name }}</span
        >
      </template>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import axios from "axios";
import { ref, computed, reactive } from "vue";
defineProps({
  fullLocation: {
    type: String,
    default: "请选择配送地址",
  },
});
const emit = defineEmits(["change"]);
// 控制展开收起，默认收起
const active = ref(false);

// 切换展开和收起
const toggleDialog = () => {
  if (active.value) {
    // 状态为收起
    close();
  } else {
    // 状态为展开
    open();
  }
};
// 打开城市选项
const open = () => {
  loading.value = true;
  active.value = true;
  // 获取数据
  getCityData().then((data) => {
    cityData.value = data;
    loading.value = false;
  });
};
// 关闭
const close = () => {
  active.value = false;
};

// 点击其他地方隐藏
const target = ref(null);
onClickOutside(target, () => {
  active.value = false;
});

// 获取城市数据的接口
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData);
    } else {
      // 无缓存
      const url =
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json";
      axios.get(url).then((res) => {
        window.cityData = res.data;
        resolve(window.cityData);
      });
    }
  });
};
// 获取城市数据，显示当前地方列表
const loading = ref(false);
const cityData = ref([]);

// 定义计算属性
const currList = computed(() => {
  const currList = cityData.value;
  return currList;
});

const changeResult = reactive({
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  countyCode: "",
  countyName: "",
  fullLocation: "",
});

const changeCity = (item) => {
  if (item.level === 0) {
    // 代表点击的省
    cityData.value = item.areaList;
    changeResult.provinceCode = item.code;
    changeResult.provinceName = item.name;
  } else if (item.level === 1) {
    // 代表点击的市
    cityData.value = item.areaList;
    changeResult.cityCode = item.code;
    changeResult.cityName = item.name;
  } else {
    // 点击的区
    changeResult.countyCode = item.code;
    changeResult.countyName = item.name;
    // 完整路径
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;
    // 关闭弹层
    close();
    emit("change", changeResult);
  }
};
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
