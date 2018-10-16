const Router = require('koa-router')

const router = new Router()

router.prefix('/view')

router.get('/',(ctx,next)=>{
    ctx.body = "hello view module router"
})

module.exports = router
