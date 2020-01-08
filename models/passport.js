const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("./keys");
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const DB = require("../models/db.js");
module.exports = passport => {
  passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    // console.log(jwt_payload)
    const user = await DB.find("user", {
      "id": jwt_payload.id
    })
    if (user) {
      return done(null,user[0])
    }else{
      return done(null,false)
    }
  }));
}