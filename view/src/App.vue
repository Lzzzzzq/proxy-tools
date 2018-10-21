<template>
  <div class="layout">
    <Layout :style="{'height': '100%'}">
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
          </div>
        </Menu>
      </Header>
      <Layout  :style="{}" theme="light">
        <Sider :style="{background: '#fff'}">
          <Menu :active-name="$route.path" theme="light" width="auto" @on-select="handleSelectNav">
            <MenuItem name="/changeHosts">
            <Icon type="ios-construct" /> host 管理
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '24px'}">
          <Content :style="{padding: '24px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  name: 'Wrap',
  methods: {
    handleSelectNav: function (path) {
      this.$router.push(path)
    }
  }
}
</script>
<style>
html,
body {
  height: 100%;
}
</style>

<style scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
