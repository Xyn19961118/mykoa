const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();
const Keys = require("./models/keys");
const session = require('koa-session')
app.keys = Keys.secretOrKey;
app.use(session({}, app))

const passport = require('koa-passport')
app.use(require("koa-bodyparser")({
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}));
app.use(passport.initialize())
app.use(passport.session())

require("./models/passport")(passport);

//子路由 api
const api = require("./router/api.js");


router.use("/api",api)

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 5000;
app.listen(port,()=>{
  console.log(`服务器运行在${port}端口`)
})