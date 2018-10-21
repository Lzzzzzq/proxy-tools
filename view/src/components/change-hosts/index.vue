<template>
  <div ref="contWrap">
    <Button type="primary" @click="modal = true">新增host</Button>
    <Divider></Divider>
    <Table stripe :columns="columns" :data="data" ref="table"></Table>
    <Modal
      title="添加Host"
      v-model="modal"
      loading
      ok-text="添加"
      :closable="false"
      @on-ok="handleClickAdd"
      @on-cancel="handleClickCancel"
    >
      <Input v-model="address" placeholder="请输入地址" style="padding: 10px 0" />
      <Input v-model="ip" placeholder="请输入ip" style="padding: 10px 0"  />
      <div slot="footer">
          <Button type="text" @click="handleClickCancel">取消</Button>
          <Button type="primary" @click="handleClickAdd" :disabled="!address || !ip">添加</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import * as actions from '@/actions'

export default {
  name: 'ChangeHosts',
  mounted: function () {
    this.getAllHosts()
    console.log(this.$refs.contWrap.clientHeight)
  },
  data () {
    return {
      address: '',
      ip: '',
      addLoading: false,
      modal: false,
      columns: [
        {
          title: 'State',
          key: 'active',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.active
                },
                nativeOn: {
                  click: () => {
                    this.handleChangeState(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: 'Ip',
          key: 'ip'
        }, {
          title: 'Operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
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
          // this.data = data.data
          this.data = data.data.concat(data.data)
        } else {
          this.$Modal.error({
            title: '错误',
            content: data.msg
          })
        }
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 修改某条hosts状态
     */
    handleChangeState: async function (item) {
      try {
        let { data } = await actions.changeState({
          address: item.address,
          ip: item.ip
        })
        if (data.state !== 1) {
          this.$Modal.error({
            title: '错误',
            content: data.msg
          })
        }
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 点击了添加
     */
    handleClickAdd: async function () {
      try {
        let {address, ip} = this
        let {data} = await actions.addHost({
          address,
          ip
        })
        if (data.state === 1) {
          this.$Message.success({
            content: '添加成功'
          })
          this.handleClickCancel()
          this.data = data.data
        } else {
          this.$Modal.error({
            title: '错误',
            content: data.msg
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    /**
     * 点击了关闭
     */
    handleClickCancel: function () {
      this.address = ''
      this.ip = ''
      this.modal = false
    },

    /**
     * 点击了删除
     */
    handleDelete: async function (item) {
      try {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该条host吗',
          onOk: async () => {
            let {address, ip} = item
            let {data} = await actions.deleteHost({
              address,
              ip
            })
            if (data.state === 1) {
              this.$Message.success({
                content: '删除成功'
              })
              this.data = data.data
            } else {
              this.$Modal.error({
                title: '错误',
                content: data.msg
              })
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style>
</style>
