const Router = require('koa-router')
const file = require('../utils/file')

const router = new Router()

router.prefix('/view')

router.get('/',(ctx,next)=>{
  ctx.type = 'html';
  ctx.body = file.getView()
})

module.exports = router
