<template>
  <div class="hostsWrap" ref="contWrap">
    <div ref="hostsTop" style="overflow: hidden">
      <el-button type="primary" @click="handleClickAdd" size="small">新增host</el-button>
      <el-button type="info" @click="handleClickAddHostsFile" size="small">导入本地hosts文件</el-button>
      <div class="hostsDivider"></div>
    </div>
    <el-table :data="data" style="width: 100%" border stripe>
      <el-table-column prop="active" label="State" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" @change="handleChangeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address"
        :filters="autoAddress"
        :filter-method="addressFilterHandler"
        filter-placement="bottom"
        :filter-multiple="false"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="Ip"
        :filters="autoIp"
        :filter-method="ipFilterHandler"
        filter-placement="bottom"
        :filter-multiple="false"
      >
      </el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <el-button type="warning" @click="handleClickEdit(scope.row)" size="small">
            编辑
          </el-button>
          <el-button type="danger" @click="handleClickDelete(scope.row)" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增host" :visible.sync="addModal" width="550px">
      <el-autocomplete
        class="inline-input"
        v-model="address"
        :fetch-suggestions="querySearchAddress"
        placeholder="请输入地址"
        style="margin: 10px 0; width: 100%"
        clearable
      ></el-autocomplete>
      <el-autocomplete
        class="inline-input"
        v-model="ip"
        :fetch-suggestions="querySearchIp"
        placeholder="请输入ip"
        style="margin: 10px 0; width: 100%"
        clearable
      ></el-autocomplete>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addModal = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAdd" size="small" :disabled="!address || !ip">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑host" :visible.sync="editModal" width="550px">
      <el-input v-model="address" style="margin: 10px 0" placeholder="请输入地址"></el-input>
      <el-input v-model="ip" style="margin: 10px 0" placeholder="请输入ip"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editModal = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEdit" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入hosts文件" :visible.sync="addHostsFileModal" width="550px">
      <el-alert
        title="已添加过的hosts将不会被导入"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-input type="textarea" rows="12" placeholder="请将本地hosts文件内容贴入" spell-check="false" resize="none" v-model="hostsFile" style="margin: 10px 0"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHostsFileModal = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSubmitHostsFile" size="small" :disabled="!hostsFile">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as actions from '@/actions'

export default {
  name: 'ChangeHosts',
  mounted: function () {
    this.getAllHosts()
  },
  data () {
    return {
      addModal: false,
      editModal: false,
      addHostsFileModal: false,

      address: '',
      ip: '',
      hostsFile: '',
      id: '',
      addLoading: false,
      modal: false,
      autoAddress: [],
      autoIp: [],
      data: []
    }
  },
  methods: {
    /**
     * 获取所有hosts
     */
    getAllHosts: async function () {
      try {
        let { data } = await actions.getAllHosts()
        if (data.state === 1) {
          this.data = data.data
          this.updateFilter()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 生成过滤器
     */
    updateFilter: function () {
      let addressList = []
      let ipList = []
      this.data.map(item => {
        addressList.push(item.address)
        ipList.push(item.ip)
      })
      addressList = [...new Set(addressList)]
      ipList = [...new Set(ipList)]
      this.autoAddress = addressList.map(item => ({
        text: item,
        value: item
      }))
      this.autoIp = ipList.map(item => ({
        text: item,
        value: item
      }))
    },

    /**
     * 修改某条hosts状态
     */
    handleChangeState: async function (item) {
      try {
        let { data } = await actions.changeState({
          id: item.id
        })
        if (data.state !== 1) {
          this.$message({
            type: 'error',
            message: data.msg
          })
        } else {
          this.$message({
            type: item.active ? 'success' : 'warning',
            message: item.active ? '已开启' : '已关闭'
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 点击了添加
     */
    handleSubmitAdd: async function () {
      try {
        let {address, ip} = this
        let {data} = await actions.addHost({
          address,
          ip
        })
        if (data.state === 1) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.addModal = false
          this.data = data.data
          this.updateFilter()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 点击了删除
     */
    handleClickDelete: async function (item) {
      try {
        this.$confirm('确认要删除该条host吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {id} = item
          let {data} = await actions.deleteHost({
            id
          })
          if (data.state === 1) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.data = data.data
            this.updateFilter()
          } else {
            this.$message({
              type: 'error',
              message: '错误'
            })
          }
        }).catch(() => {
        })
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 点击了编辑
     */
    handleClickEdit: async function (item) {
      this.address = item.address
      this.ip = item.ip
      this.id = item.id
      this.editModal = true
    },

    /**
     * 点击了新增
     */
    handleClickAdd: function () {
      this.address = ''
      this.ip = ''
      this.addModal = true
    },

    /**
     * 确认编辑
     */
    handleSubmitEdit: async function () {
      try {
        let {address, ip, id} = this
        let {data} = await actions.editHost({
          address,
          ip,
          id
        })
        if (data.state === 1) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.editModal = false
          this.data = data.data
          this.updateFilter()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * address 筛选
     */
    addressFilterHandler: function (value, row, column) {
      return row.address === value
    },

    /**
     * ip 筛选
     */
    ipFilterHandler: function (value, row, column) {
      return row.ip === value
    },

    /**
     * 地址输入建议
     */
    querySearchAddress: function (queryString, cb) {
      let autoAddress = this.autoAddress
      let results = queryString ? autoAddress.filter(this.createFilter(queryString)) : autoAddress
      cb(results)
    },

    /**
     * ip输入建议
     */
    querySearchIp: function (queryString, cb) {
      let autoIp = this.autoIp
      let results = queryString ? autoIp.filter(this.createFilter(queryString)) : autoIp
      cb(results)
    },

    /**
     * 输入建议过滤
     */
    createFilter (queryString) {
      return (res) => {
        return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    /**
     * 点击了导入hosts文件按钮
     */
    handleClickAddHostsFile: function () {
      this.hostsFile = ''
      this.addHostsFileModal = true
    },

    /**
     * 提交hosts文件
     */
    handleSubmitHostsFile: async function () {
      try {
        let {hostsFile} = this
        if (!hostsFile) return
        let {data} = await actions.importHosts({
          cont: hostsFile
        })
        if (data.state === 1) {
          this.data = data.data
          this.addHostsFileModal = false
          this.hostsFile = ''
          this.updateFilter()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      } catch (e) {
        console.error(e)
      }
      console.log(this.hostsFile)
    }
  }
}
</script>

<style>
.el-table-filter__list-item {
  color: #606266;
}
.el-table-filter {
  max-height: 500px;
  overflow: auto;
}
</style>

<style scoped>
.hostsWrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}
.hostsDivider {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  clear: both;
  background-color: #e8eaec;
}
</style>
