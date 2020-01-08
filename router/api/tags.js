const router = require("koa-router")();
const DB = require("../../models/db.js");
const passport = require("koa-passport");

/** 
 * @route POST api/tags/list
 * @desc  文章列表接口地址  
 * @access  接口是私有的
 */
router.get("/list", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const list = await DB.find("tags", {});
  ctx.status=200;
  ctx.body = list;
})

/** 
 * @route POST api/tags/add
 * @desc  添加标签接口   
 * @access  接口是私有的
 */
router.post("/add", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const data = ctx.request.body; //获取前端请求的数据
  const list = await DB.find("tags", {});
  const id = Math.max.apply(Math, list.map(function(o) {return o.id}))+1;
  if (data.name == "" || !data.name) {
    ctx.status = 200;
    ctx.body = {
      error:50001,
      msg: '请输入标签名称'
    };
  } else {
    const tagsData = {
      id,
      name: data.name
    }
    ctx.status = 200;
    DB.insert("tags", tagsData);
    ctx.body = {
      error:0,
      msg: "添加成功"
    }
  }

})


/** 
 * @route POST api/tags/edit
 * @desc  标签编辑接口地址  
 * @access  接口是私有的
 */
router.post("/edit", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  // console.log("aaa")
  const data = ctx.request.body; //获取前端请求的数据
  const id = parseInt(data.id);
  const list = await DB.find("tags", {
    id
  });

  if (list.length == 0) {
    ctx.status = 200;
    ctx.body = {
      error:50001,
      msg: '找不到该内容'
    };
  } else {
    if (data.name == "" || !data.name) {
      ctx.status = 200;
      ctx.body = {
        error:50002,
        msg: '请输入标签名称'
      };
    } else {

      let newUpDate = await DB.update("tags", {
        id: id
      }, {
        name: data.name
      });

      try {
        if (newUpDate.result.ok) {
          ctx.status = 200;
          ctx.body = {
            error:0,
            msg: '修改成功'
          }
        }
      } catch (err) {
        ctx.body = err;
      }
    }
  }

})

/** 
 * @route POST api/tags/delete
 * @desc  标签删除接口
 * @access  接口是私有的
 */
router.post("/delete", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const data = ctx.request.body; //获取前端请求的数据
  const id = parseInt(data.id);
  const deleteData = await DB.delete("tags",{
    id: id
  })
  if(deleteData){
    ctx.status = 200;
    ctx.body = {
      msg: "删除成功"
    }
  }
})

/** 
 * @route GET api/tags/detail
 * @desc  标签详情接口地址  
 * @access  接口是私有的
 */
router.get("/detail/:id", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  // console.log()
  const id = parseInt(ctx.params.id); //获取前端请求的数据
  const list = await DB.find("tags", {
    id: id
  });
  // console.log(list)
  ctx.body = list[0];
})


/** 
 * @route POST api/tags/list
 * @desc  文章列表接口地址  
 * @access  接口是私有的
 */
router.get("/tagsList", async ctx => {
  const list = await DB.find("tags", {});
  ctx.status=200;
  ctx.body = list;
})


module.exports = router.routes();