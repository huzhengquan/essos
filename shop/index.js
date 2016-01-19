var koa = require('koa'),
	views = require('koa-views'),
	path = require('path'),
    bodyParser = require('koa-bodyparser'),
    passport = require('koa-passport'),
    router = require('koa-router')();

var app= koa();

app.use(require('koa-static')(path.join(__dirname,"public")));
app.use(require('koa-generic-session')());
router.use(bodyParser());
require('./auth');
router.use(passport.initialize());
router.use(passport.session());

router.use(views('views', {
    map: { html: 'jade' },
    cache: false
}));

router.get('/auth/weixin', passport.authenticate('wechat'));
router.get('/auth/weixin/callback', passport.authenticate('wechat', {
    successReturnToOrRedirect: '/shop/#!/product/list.html',
    failureRedirect: '/shop/fail'
}));
/*
router.get('/success', function *(next){
    yield next;
    this.body='success';
});
*/
router.get('/fail', function *(){
    this.body='fail';
});

function * ensureAuthenticated(next){
    if(this.isAuthenticated() || true){
        yield next;
    }else{
        this.redirect('/shop/auth/weixin');
    }
}
/*
router.get('/user/login', function*(next){
    this.redirect('/shop/auth/weixin');
    //yield this.render('user_login.jade');
});
router.get('/user/logout', ensureAuthenticated, function *(next){
    this.body="logout";
});
*/
router.get('/', ensureAuthenticated, function*(next){
    yield this.render('layout.jade');
    //this.redirect('/shop/product/list');
});


//产品目录
router.get('/product/list.html', ensureAuthenticated, function *(next){
    yield this.render('product/list.jade');
});
router.get('/product/detail.html', ensureAuthenticated, function *(next){
    yield this.render('product/detail.jade');
});
//用户
router.get('/user/my.html', ensureAuthenticated, function *(next){
    yield this.render('user/my.jade');
});
// 订单
router.get('/user/my/order/list.html', ensureAuthenticated, function *(next){
    yield this.render('user/my_order_list.jade');
});
//系统
router.get('/system/about.html', ensureAuthenticated, function *(next){
    yield this.render('system/about.jade');
});


//
//
//
app.use(router.routes());
  //  .use(router.allowedMethods());

/*
app.use(function*(next){
    //this.body='test';
    console.log(Object.keys(this));
    yield this.render('login');
});
*/

exports.app=app;
