var passport = require("koa-passport"),
    _ = require('underscore'),
    WechatStrategy = require('passport-wechat');

var testUser={};

passport.serializeUser(function(user, done){
    done(null, user.openid);
});
passport.deserializeUser(function(openid, done){
    done(null, testUser);
});
passport.use(new WechatStrategy({
        appID:'wx987500a65067f7d2',
        appSecret: '204c52a7dd5895ea97305c369a0ed9a6',
        //clientID:'wx230d36be9daf735b',
        //clientSecret: 'da02b144f0f5fe4ef20d987356393425',
        callbackURL: 'http://192.168.1.122/shop/auth/weixin/callback',
        //scope: 'snsapi_login'
        scope: 'snsapi_userinfo'
    },
    function(accessToken, refreshToken, profile, done){
        //if not find user -> create
        //
        testUser= profile;
        return done(null, profile);
    }
));


