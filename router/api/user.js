const router = require("koa-router")();
const DB = require("../../models/db.js");
const jwt = require("jsonwebtoken");
const keys = require("../../models/keys");
const passport = require("koa-passport");


/** 
 * @route POST api/user/login
 * @desc  登录接口地址  返回token
 * @access  接口是公开的
 */
router.post("/login", async (ctx) => {
  // console.log(ctx.request.body)
  const userName = ctx.request.body.name; //用户名
  const userPassword = ctx.request.body.password; //密码
  // console.log()
  // console.log(userName)
  // console.log(userPassword)
  if (!userName) {
    ctx.status = 200;
    ctx.body = {
      error: 50001,
      msg: '用户名格式错误'
    }
  } else {
    let user = await DB.find("user", {
      "name": userName
    }); //查询name是否存在
    console.log(user)
    if (user.length == 0) {
      ctx.status = 200;
      ctx.body = {
        error: 50002,
        msg: '用户不存在'
      };
    } else {
      if (userPassword == user[0].password) {
        const payload = {
          id: user[0].id,
          name: user[0].name
        };
        const token = jwt.sign(payload, keys.secretOrKey, {
          expiresIn: 14400
        });
        // console.log(token)
        ctx.status = 200;
        ctx.body = {
          error: 0,
          msg: '登录成功',
          token: "Bearer " + token
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          error: 50003,
          msg: '登录密码错误'
        };
      }
    }
  }

})


/** 
 * @route GET api/user/current
 * @desc  查询个人接口
 * @access 接口是私密的 
 */

router.get("/current", passport.authenticate('jwt', {
  session: false
}), async (ctx) => {
  // console.log(ctx)
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name
  }
})




module.exports = router.routes();