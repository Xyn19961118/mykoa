const router = require("koa-router")();
const user = require("./api/user"); //用户
const article = require("./api/article"); //文章
const tags = require("./api/tags"); //标签

router.get("/",async (ctx)=>{
  ctx.body="Api首页"
})

router.use("/user",user);
router.use("/article",article);
router.use("/tags",tags);

module.exports = router.routes();