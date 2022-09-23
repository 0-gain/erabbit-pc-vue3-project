<template>
  <div>
    <AppNavBar />
    <AppHeader />
    <AppHeaderSticky />
    <main class="app-body">
      <router-view></router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import {
  AppHeader,
  AppHeaderSticky,
  AppNavBar,
  AppFooter,
} from "./component/index";
</script>
<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
