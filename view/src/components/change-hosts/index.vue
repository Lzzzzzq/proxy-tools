<template>
  <div class="hostsWrap" ref="contWrap">
    <el-button type="primary" @click="addModal = true" size="small">新增host</el-button>
    <div class="hostsDivider"></div>
    <el-table :data="data" style="width: 100%" border>
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

    <el-dialog title="新增host" :visible.sync="addModal">
      <el-input v-model="address" style="margin: 10px 0"></el-input>
      <el-input v-model="ip" style="margin: 10px 0">></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addModal = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑host" :visible.sync="editModal">
      <el-input v-model="address" style="margin: 10px 0"></el-input>
      <el-input v-model="ip" style="margin: 10px 0">></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editModal = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
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

      address: '',
      ip: '',
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
     * 生成渲染器
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
    }
  }
}
</script>

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
