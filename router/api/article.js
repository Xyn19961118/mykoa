const router = require("koa-router")();
const DB = require("../../models/db.js");
const passport = require("koa-passport");

/** 
 * @route POST api/article/list
 * @desc  文章列表接口地址  
 * @access  接口是私有的
 */
router.post("/list", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const data = ctx.request.body; //获取前端请求的数据
  let page = parseInt(data.page);
  let pageSize = parseInt(data.pagesize);
  // console.log(data)
  if (!page) {
    ctx.status = 200;
    ctx.body = {
      error: 50001,
      msg: "页码请求错误"
    }
  } else if (!pageSize) {
    ctx.status = 200;
    ctx.body = {
      error: 50002,
      msg: "请求数量错误"
    }
  } else {
    page--;
    const list = await DB.find("article", {}, pageSize, page);
    // console.log(list)
    ctx.status = 200;
    ctx.body = {
      error: 0,
      msg: "请求成功",
      list
    };
  }

})

/** 
 * @route POST api/article/add
 * @desc  添加文章接口   
 * @access  接口是私有的
 */
router.post("/add", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const data = ctx.request.body; //获取前端请求的数据
  // console.log(data)
  const list = await DB.find("article", {});
  const id = Math.max.apply(Math, list.map(function (o) {
    return o.id
  })) + 1;
  // console.log(id)

  if (data.title == "" || !data.title) {
    ctx.status = 200;
    ctx.body = {
      error: 50001,
      msg: '请输入文章标题'
    };
  } else if (data.content == "" || !data.content) {
    ctx.status = 200;
    ctx.body = {
      error: 50002,
      msg: '请填写文章内容'
    };
  } else if (data.addtime == null || !data.addtime) {
    ctx.status = 200;
    ctx.body = {
      error: 50003,
      msg: '请填写时间'
    };
  } else if (data.tags == null || !data.tags) {
    ctx.status = 200;
    ctx.body = {
      error: 50004,
      msg: '请填写标签'
    };
  } else {
    const articleData = {
      id,
      tags: data.tags,
      title: data.title,
      content: data.content,
      addtime: data.addtime
    }
    ctx.status = 200;
    DB.insert("article", articleData);
    ctx.body = {
      error: 0,
      msg: "添加成功"
    }
  }

})


/** 
 * @route POST api/article/edit
 * @desc  文章编辑接口地址  
 * @access  接口是私有的
 */
router.post("/edit", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  // console.log("aaa")
  const data = ctx.request.body; //获取前端请求的数据
  const id = parseInt(data.id);
  const list = await DB.find("article", {
    id
  });

  if (list.length == 0) {
    ctx.status = 200;
    ctx.body = {
      error: 50001,
      msg: '找不到该内容'
    };
  } else {
    if (data.title == "" || !data.title) {
      ctx.status = 200;
      ctx.body = {
        error: 50002,
        msg: '请输入文章标题'
      };
    } else if (data.content == "" || !data.content) {
      ctx.status = 200;
      ctx.body = {
        error: 50003,
        msg: '请填写文章内容'
      };
    } else if (data.addtime == null || !data.addtime) {
      ctx.status = 200;
      ctx.body = {
        error: 50004,
        msg: '请填写时间'
      };
    } else if (data.tags == null || !data.tags) {
      ctx.status = 200;
      ctx.body = {
        error: 50005,
        msg: '请填写标签'
      };
    } else {

      let newUpDate = await DB.update("article", {
        id: id
      }, {
        title: data.title,
        content: data.content,
        addtime: data.addtime,
        tags: data.tags
      });

      try {
        if (newUpDate.result.ok) {
          ctx.status = 200;
          ctx.body = {
            error: 0,
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
 * @route POST api/article/delete
 * @desc  文章删除接口
 * @access  接口是私有的
 */
router.post("/delete", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const data = ctx.request.body; //获取前端请求的数据
  // console.log(data)
  const id = parseInt(data.id);
  const deleteData = await DB.delete("article", {
    id: id
  })
  if (deleteData) {
    ctx.status = 200;
    ctx.body = {
      msg: "删除成功"
    }
  }
})

/** 
 * @route GET api/article/detail
 * @desc  文章详情接口地址  
 * @access  接口是私有的
 */
router.get("/detail/:id", passport.authenticate('jwt', {
  session: false
}), async ctx => {
  // console.log()
  const id = parseInt(ctx.params.id); //获取前端请求的数据
  const list = await DB.find("article", {
    id: id
  });
  // console.log(list)
  ctx.body = list[0];
})


/** 
 * @route POST api/article/articleList
 * @desc  文章列表接口地址  
 * @access  接口是公开的
 */
router.post("/articleList", async ctx => {
  // console.log()
  const data = ctx.request.body; //获取前端请求的数据
  let page = parseInt(data.page);
  let pageSize = parseInt(data.pagesize);
  // console.log(data)
  if (!page) {
    ctx.status = 200;
    ctx.body = {
      error: 50001,
      msg: "页码请求错误"
    }
  } else if (!pageSize) {
    ctx.status = 200;
    ctx.body = {
      error: 50002,
      msg: "请求数量错误"
    }
  } else {
    page--;
    const list = await DB.find("article", {}, pageSize, page,{ addtime: -1 });
    // console.log(list)
    ctx.status = 200;
    ctx.body = {
      error: 0,
      msg: "请求成功",
      list
    };
  }
})

/** 
 * @route POST api/article/hotArticle
 * @desc  文章列表接口地址  
 * @access  接口是公开的
 */
router.get("/hotArticle", async ctx => {
  // console.log()
  const list = await DB.find("article", {}, 10, 0,{ read: -1 });
    // console.log(list)
    ctx.status = 200;
    ctx.body = {
      error: 0,
      msg: "请求成功",
      list
    };
})

/** 
 * @route POST api/article/detail
 * @desc  文章详情接口地址  
 * @access  接口是私有的
 */
router.post("/articleDetail", async ctx => {
  // console.log()
  const id = parseInt(ctx.request.body.id); //获取前端请求的数据
  // console.log(id)
  const list = await DB.find("article", {
    id: id
  });
  // console.log(list)
  ctx.status = 200;
  ctx.body = list[0];
})


module.exports = router.routes();