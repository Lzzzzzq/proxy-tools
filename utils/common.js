module.exports = {

  /**
   * 报错
   */
  postError: (ctx, e, code) => {
    console.error(e)
    ctx.throw(code)
    ctx.body = {
      state: 0,
      msg: '服务错误'
    }
  }
  
}