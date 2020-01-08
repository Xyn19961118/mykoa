//连接MongoDB数据库
const MongoClient = require("mongodb").MongoClient;
const config = require("./config.js");
const ObjectId = require("mongodb").ObjectID;
class Db {
  //单例
  static getInstance() {
    if (!this.instance) {
      this.instance = new Db();
    }
    return this.instance;
  }

  constructor() {
    this.dbClient = "";
    this.connect();
  }
  //连接数据库
  connect() {
    return new Promise((resolve, reject) => {
      //判断是否连接
      if (!this.dbClient) {
        MongoClient.connect(config.dbUrl, {
          useNewUrlParser: true
        }, (err, client) => {
          if (err) {
            reject(err)
          } else {
            let db = client.db(config.dbName);
            this.dbClient = db;
            resolve(this.dbClient)
          }
        })
      } else {
        resolve(this.dbClient);
      }

    })
  }

  //增
  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        });

      })
    })
  }

  //删
  delete(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).deleteOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        });

      })
    })
  }

  //改
  update(collectionName, json, updateJson) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).updateOne(json, {
          $set: updateJson
        }, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        });

      })
    })
  }


  //查
  find(collectionName, json, pagesize, page=0,sortName) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = null;
        if(sortName && pagesize){
          // console.log("aa")
          result=db.collection(collectionName).find(json).sort(sortName).limit(pagesize).skip(page*pagesize);
        }else if(pagesize){
          // console.log("bb")
          result = db.collection(collectionName).find(json).limit(pagesize).skip(page*pagesize);
        }else{
          result = db.collection(collectionName).find(json)
        }
        // console.log(result)
        result.toArray((err, docs) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(docs);
        })
      })
    })
  }





  //自增id
  // increase(sequenceName) {
  //   return new Promise((resolve, reject) => {
  //     this.connect().then(db => {
  //       // console.log(db.collection("productid"))
  //       let sequenceDocument = db.collection("productid").findOneAndUpdate({
  //         query: {
  //           name: sequenceName
  //         },
  //         update: {
  //           $inc: {
  //             sequence_value: 1
  //           }
  //         },
  //         "new": true
  //       });
  //       resolve(sequenceDocument);
  //       // let result = db.collection(collectionName).find(json);
  //       // result.toArray((err, docs) => {
  //       //   if (err) {
  //       //     reject(err);
  //       //     return;
  //       //   }
  //       //   resolve(docs)
  //       // })
  //     })
  //   })
  // }

  //获取id
  getObjectId(id) {
    return new ObjectId(id)
  }

}

module.exports = Db.getInstance()