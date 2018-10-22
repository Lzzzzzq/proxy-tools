<template>
  <div class="layout">
    <el-container style="height: 100%">
      <el-header style="background-color: #515a6e"></el-header>
      <el-container style="height: 100%">
        <el-aside width="200px">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            style="height: 100%"
            router
          >
            <el-menu-item index="/changeHosts">
              <i class="el-icon-setting"></i>
              <span slot="title">host管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Wrap'
}
</script>
<style>
html,
body {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
.el-menu {
  border-right: 0;
}
</style>

<style scoped>
.layout {
  height: 100%;
  background-color: #f5f7f9;
}
</style>
